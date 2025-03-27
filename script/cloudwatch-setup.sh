#!/bin/bash

# Download the CloudWatch Unified Agent
wget -O /tmp/amazon-cloudwatch-agent.deb https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb

# Verify that the package was downloaded
if [ ! -f /tmp/amazon-cloudwatch-agent.deb ]; then
    echo "CloudWatch agent package not found. Exiting."
    exit 1
fi
echo "CloudWatch agent package downloaded."

# Install the agent
sudo dpkg -i -E /tmp/amazon-cloudwatch-agent.deb

# Verify agent installed successfully
if ! command -v /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl &> /dev/null; then
    echo "CloudWatch agent installation failed."
    exit 1
fi
echo "CloudWatch agent installed."

# Create config folder (if not exists)
sudo mkdir -p /opt/aws/amazon-cloudwatch-agent/etc/

# Check if config file exists before copying
if [ -f /tmp/cloudwatch-config.json ]; then
    sudo cp /tmp/cloudwatch-config.json /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json
    echo "Config file copied."
else
    echo "Config file not found. Skipping copy."
    exit 1
fi

# Validate the configuration (optional, but useful)
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
    -a validate-config \
    -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json

# Enable service to start at boot
sudo systemctl enable amazon-cloudwatch-agent.service

echo "CloudWatch Agent setup complete."
