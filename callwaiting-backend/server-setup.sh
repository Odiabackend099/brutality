#!/bin/bash

# CallWaiting AI - Server Security Setup Script
# This script hardens a Ubuntu/Debian server for production deployment

set -e  # Exit on any error

echo "🔒 CallWaiting AI - Server Security Setup"
echo "========================================"

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo "❌ This script should not be run as root for security reasons"
   echo "Please run as a regular user with sudo privileges"
   exit 1
fi

# Check if sudo is available
if ! sudo -n true 2>/dev/null; then
    echo "❌ This script requires sudo privileges"
    echo "Please ensure your user has sudo access"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential security packages
echo "🔧 Installing security packages..."
sudo apt install -y \
    ufw \
    fail2ban \
    lynis \
    aide \
    htop \
    curl \
    wget \
    git \
    docker.io \
    docker-compose \
    unattended-upgrades

# Enable Docker for current user
echo "🐳 Configuring Docker..."
sudo usermod -aG docker $USER
sudo systemctl enable docker
sudo systemctl start docker

# Configure UFW firewall
echo "🔥 Configuring firewall..."
sudo ufw --force reset
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS

# Enable firewall
sudo ufw --force enable

# Configure fail2ban
echo "🚨 Configuring fail2ban..."
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Create custom fail2ban config for web applications
sudo tee /etc/fail2ban/jail.d/callwaiting.conf > /dev/null <<EOF
[callwaiting-webhook]
enabled = true
port = http,https
filter = callwaiting-webhook
logpath = /var/log/nginx/access.log
maxretry = 10
bantime = 3600
findtime = 600
EOF

# Create fail2ban filter for webhook attacks
sudo tee /etc/fail2ban/filter.d/callwaiting-webhook.conf > /dev/null <<EOF
[Definition]
failregex = ^<HOST> -.*"(GET|POST) /webhook/.*" (4\d\d|5\d\d) .*$
ignoreregex =
EOF

# Start fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Configure automatic security updates
echo "🔄 Configuring automatic updates..."
sudo dpkg-reconfigure -plow unattended-upgrades

# Configure file integrity monitoring
echo "📁 Setting up file integrity monitoring..."
sudo aideinit
sudo mv /var/lib/aide/aide.db.new /var/lib/aide/aide.db

# Create daily security check script
sudo tee /usr/local/bin/daily-security-check.sh > /dev/null <<EOF
#!/bin/bash
echo "Daily Security Check - \$(date)"

# Check for failed login attempts
echo "Failed SSH attempts:"
sudo grep "Failed password" /var/log/auth.log | tail -10

# Check fail2ban status
echo "Fail2ban status:"
sudo fail2ban-client status

# Check UFW status
echo "Firewall status:"
sudo ufw status

# Check system updates
echo "Available updates:"
sudo apt list --upgradable

# Check Docker containers
echo "Docker containers:"
docker ps

# Check n8n logs for errors
if docker ps | grep -q n8n; then
    echo "Recent n8n errors:"
    docker-compose logs --tail=20 n8n-main | grep -i error || echo "No recent errors"
fi
EOF

sudo chmod +x /usr/local/bin/daily-security-check.sh

# Create cron job for daily security checks
(crontab -l 2>/dev/null; echo "0 6 * * * /usr/local/bin/daily-security-check.sh >> /var/log/security-check.log 2>&1") | crontab -

# Create security monitoring script
sudo tee /usr/local/bin/security-monitor.sh > /dev/null <<EOF
#!/bin/bash
# Monitor for suspicious activity

# Check for webhook attacks
if docker ps | grep -q n8n; then
    WEBHOOK_ATTACKS=\$(docker-compose logs --since=1h n8n-main | grep -c "signature-mismatch" || echo "0")
    if [ "\$WEBHOOK_ATTACKS" -gt 10 ]; then
        echo "ALERT: High number of webhook signature failures (\$WEBHOOK_ATTACKS) in last hour"
        # Send alert email (configure with your email)
        # echo "High webhook attacks detected" | mail -s "Security Alert" admin@callwaitingai.dev
    fi
fi

# Check for failed SSH attempts
SSH_FAILURES=\$(sudo grep "Failed password" /var/log/auth.log | grep "\$(date '+%b %d')" | wc -l)
if [ "\$SSH_FAILURES" -gt 20 ]; then
    echo "ALERT: High number of SSH failures (\$SSH_FAILURES) today"
fi
EOF

sudo chmod +x /usr/local/bin/security-monitor.sh

# Create logrotate config for security logs
sudo tee /etc/logrotate.d/callwaiting-security > /dev/null <<EOF
/var/log/security-check.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 root root
}
EOF

# Set up log monitoring
sudo tee /etc/rsyslog.d/50-callwaiting.conf > /dev/null <<EOF
# Monitor n8n webhook logs
if \$programname == 'docker' and \$msg contains 'webhook' then /var/log/callwaiting-webhook.log
EOF

sudo systemctl restart rsyslog

echo ""
echo "🎉 Server security setup completed!"
echo ""
echo "Next steps:"
echo "1. Reboot the server: sudo reboot"
echo "2. Deploy CallWaiting AI backend: ./deploy.sh"
echo "3. Configure SSL certificate: sudo certbot --nginx -d n8n.odia.dev"
echo "4. Set up monitoring alerts"
echo ""
echo "Security features enabled:"
echo "✅ Firewall (UFW) configured"
echo "✅ Fail2ban intrusion detection"
echo "✅ Automatic security updates"
echo "✅ File integrity monitoring (AIDE)"
echo "✅ Daily security checks"
echo "✅ Log monitoring and rotation"
echo ""
echo "📖 See SECURITY_HARDENING.md for detailed security documentation"
echo "🔒 Remember to rotate all secrets and configure monitoring alerts!"
