# CallWaiting AI - Security Hardening Guide

## 🚨 Critical Security Improvements Applied

This guide covers the production-level security hardening measures implemented in the CallWaiting AI backend.

## 🔐 Webhook Signature Verification

### HMAC-SHA256 Implementation

The payment workflow now uses proper HMAC-SHA256 verification instead of simple string comparison:

```javascript
// Compute HMAC-SHA256 of raw body with secret
const crypto = require('crypto');
const expectedSig = crypto
  .createHmac('sha256', secret)
  .update(rawBody)
  .digest('base64');

// Compare with received signature
if (receivedSig !== expectedSig) {
  // Reject webhook
}
```

### Timestamp Freshness Check

Optional timestamp validation to prevent replay attacks:

```javascript
// Check webhook age (Flutterwave webhooks expire in ~60 seconds)
if (payload.timestamp) {
  const ageSeconds = (Date.now() - new Date(payload.timestamp).getTime()) / 1000;
  if (ageSeconds > 60) {
    // Reject old webhook
  }
}
```

## 🛡️ n8n Security Hardening

### Block Dangerous Nodes

The deployment blocks potentially dangerous nodes via `NODES_EXCLUDE`:

```bash
NODES_EXCLUDE=ExecuteCommand,ReadFile,WriteFile,ReadBinaryFile,WriteBinaryFile,HTTPRequest,Webhook
```

**Blocked nodes:**
- `ExecuteCommand` - Prevents arbitrary command execution
- `ReadFile/WriteFile` - Prevents file system access
- `ReadBinaryFile/WriteBinaryFile` - Prevents binary file access
- `HTTPRequest` - Forces use of configured HTTP nodes
- `Webhook` - Prevents unauthorized webhook creation

### External Task Runners

For additional security, run task execution in isolated containers:

```yaml
# Separate worker containers for code execution
n8n-worker:
  image: n8nio/n8n:latest
  command: ["n8n", "worker"]
  # Isolated environment for code execution
```

## 🔥 Server-Level Security

### Firewall Configuration (UFW)

```bash
# Install and configure UFW
sudo apt install ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow only necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS

# Enable firewall
sudo ufw enable
```

### System Hardening

```bash
# Keep system updated
sudo apt update && sudo apt upgrade -y

# Install fail2ban for intrusion detection
sudo apt install fail2ban

# Configure fail2ban for SSH and web attacks
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### Docker Security

```bash
# Run Docker containers as non-root user
# Add to docker-compose.yml:
user: "1000:1000"

# Use read-only filesystems where possible
read_only: true
tmpfs:
  - /tmp
  - /var/tmp
```

## 🔍 Security Monitoring

### Log Monitoring

```bash
# Monitor n8n logs for suspicious activity
docker-compose logs -f n8n-main | grep -E "(error|fail|unauthorized)"

# Monitor webhook attempts
docker-compose logs -f n8n-main | grep "webhook"
```

### Audit Checklist

Regular security audits should include:

- [ ] Review n8n execution logs for anomalies
- [ ] Check for failed webhook signature verifications
- [ ] Verify credential usage and permissions
- [ ] Remove unused integrations and workflows
- [ ] Update dependencies and system packages
- [ ] Review firewall rules and access logs
- [ ] Test backup and recovery procedures

## 🚨 Incident Response

### Webhook Security Incidents

If you detect suspicious webhook activity:

1. **Immediate Response:**
   ```bash
   # Block suspicious IPs
   sudo ufw deny from <suspicious_ip>
   
   # Check logs
   docker-compose logs n8n-main | grep <suspicious_ip>
   ```

2. **Investigation:**
   - Review webhook signature failures
   - Check for unauthorized workflow executions
   - Analyze payload patterns

3. **Recovery:**
   - Rotate webhook secrets
   - Update firewall rules
   - Review and update security policies

### Data Breach Response

If a security incident occurs:

1. **Containment:**
   - Isolate affected systems
   - Preserve logs and evidence
   - Notify stakeholders

2. **Assessment:**
   - Determine scope of breach
   - Identify compromised data
   - Assess business impact

3. **Recovery:**
   - Patch vulnerabilities
   - Restore from clean backups
   - Implement additional monitoring

## 📋 Security Compliance

### PCI DSS (Payment Card Industry)

For payment processing compliance:

- [ ] Use hosted payment pages (Flutterwave)
- [ ] Encrypt sensitive data in transit and at rest
- [ ] Implement access controls and authentication
- [ ] Regular security testing and monitoring
- [ ] Maintain information security policies

### GDPR (General Data Protection Regulation)

For data protection compliance:

- [ ] Implement data minimization
- [ ] Provide data portability
- [ ] Enable right to deletion
- [ ] Maintain data processing records
- [ ] Implement privacy by design

## 🔧 Security Tools

### Recommended Security Tools

```bash
# Vulnerability scanning
sudo apt install lynis
sudo lynis audit system

# Network monitoring
sudo apt install nethogs iftop

# File integrity monitoring
sudo apt install aide
sudo aideinit
sudo aide --check
```

### Monitoring Scripts

Create monitoring scripts for:

- Failed webhook attempts
- Unusual traffic patterns
- System resource usage
- Docker container health
- Database connection monitoring

## 📞 Security Contacts

For security issues:

- **Emergency**: callwaitingai@gmail.com
- **Security Issues**: Include "SECURITY" in subject line
- **Response Time**: Within 24 hours for critical issues

## 🔄 Regular Security Maintenance

### Monthly Tasks

- [ ] Update system packages
- [ ] Review security logs
- [ ] Test backup procedures
- [ ] Update firewall rules
- [ ] Review user access

### Quarterly Tasks

- [ ] Security audit and penetration testing
- [ ] Review and update security policies
- [ ] Update incident response procedures
- [ ] Train team on security best practices
- [ ] Review compliance requirements

---

**Remember: Security is an ongoing process, not a one-time setup. Regular monitoring and updates are essential for maintaining a secure system.**
