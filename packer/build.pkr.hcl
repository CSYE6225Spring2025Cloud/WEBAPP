build {
  # sources = ["source.amazon-ebs.webapp_ami", "source.googlecompute.gcp_webapp"]
  sources = ["source.amazon-ebs.webapp_ami"]

  # Copy the src/ directory to the instance
  provisioner "file" {
    source      = "./src"
    destination = "/tmp/app"
  }

  # Provision the instance and create .env dynamically
  provisioner "shell" {
    inline = [
      "echo 'Running setup script...'",
      "sudo apt update -y",
      "sudo apt upgrade -y",
      "sudo apt --fix-broken install -y",
      # "sudo apt remove --purge mysql-server mysql-client mysql-common mysql-server-core-* mysql-client-core-* -y || true",
      # "sudo rm -rf /etc/mysql /var/lib/mysql /var/log/mysql",
      # "sudo apt autoremove -y",
      # "sudo apt autoclean -y",
      "sudo apt install -y nodejs npm",
      # "sudo systemctl start mysql",
      # "sudo systemctl enable mysql",
      # "ROOT_PASSWORD='${var.mysql_password}'",
      # "sudo mysql -e \"ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$ROOT_PASSWORD'; FLUSH PRIVILEGES;\"",
      # "sudo mysql -u root -p\"$ROOT_PASSWORD\" <<EOF",
      # "DELETE FROM mysql.user WHERE User='';",
      # "DROP DATABASE IF EXISTS test;",
      # "DELETE FROM mysql.db WHERE Db='test' OR Db='test_%';",
      # "FLUSH PRIVILEGES;",
      # "EOF",
      # "sudo mysql --user=root --password=\"$ROOT_PASSWORD\" -e \"CREATE DATABASE ${var.mysql_database};\"",
      # "sudo mysql -e \"ALTER USER '${var.mysql_user}'@'localhost' IDENTIFIED WITH 'mysql_native_password' BY '${var.mysql_password}'; CREATE DATABASE IF NOT EXISTS ${var.mysql_database}; GRANT ALL PRIVILEGES ON ${var.mysql_database}.* TO '${var.mysql_user}'@'localhost'; FLUSH PRIVILEGES;\"",
      "sudo useradd -r -s /usr/sbin/nologin csye6225 || true",
      "getent group csye6225 || sudo groupadd csye6225",
      "sudo usermod -a -G csye6225 csye6225",

      # "sudo useradd -r -s /usr/sbin/nologin csye6225 || true", # Ignore failure if user exists
      # "getent group csye6225 || sudo groupadd csye6225",       # Create group only if it doesn’t exist
      # "sudo usermod -a -G csye6225 csye6225",
      "sudo mkdir -p /opt/csye6225/app",
      "sudo cp -r /tmp/app/* /opt/csye6225/app",

      # Create .env file dynamically
      # "sudo bash -c 'echo \"DATABASE_URL=mysql://root:${var.mysql_password}@localhost:3306/${var.mysql_database}\" > /opt/csye6225/app/.env'",
      # "sudo bash -c 'echo \"PORT=${var.app_port}\" >> /opt/csye6225/app/.env'",
      # "sudo bash -c 'echo \"NODE_ENV=production\" >> /opt/csye6225/app/.env'",

      # Install dependencies inside srcz /
      "cd /opt/csye6225/app",
      "sudo npm install",
      "sudo chown -R csye6225:csye6225 /opt/csye6225/app",

      # Set up systemd service
      "sudo cp /opt/csye6225/app/csye6225.service /etc/systemd/system/csye6225.service",
      "sudo systemctl daemon-reload",
      "sudo systemctl enable csye6225.service",

      "echo 'Setup completed successfully!'"
    ]
  }
}
