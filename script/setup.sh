#!/bin/bash

# Log output for debugging
exec > >(tee -i /var/log/setup.log)
exec 2>&1

# Step 1: Updating the package lists
echo "Updating package lists..."
sudo apt update -y

# Step 2: Upgrading packages
echo "Upgrading packages..."
sudo apt upgrade -y

# Step 3: Fixing broken packages if needed
echo "Fixing broken dependencies..."
sudo apt --fix-broken install -y

# Step 4: Removing any existing MySQL installation to prevent conflicts
echo "Removing previous MySQL installation (if any)..."
sudo apt remove --purge mysql-server mysql-client mysql-common mysql-server-core-* mysql-client-core-* -y || true
sudo rm -rf /etc/mysql /var/lib/mysql /var/log/mysql
sudo apt autoremove -y
sudo apt autoclean -y

# Step 5: Installing MySQL Server
echo "Installing MySQL Server..."
sudo apt install -y mysql-server

# Step 6: Start and Enable MySQL Service
echo "Starting and enabling MySQL service..."
sudo systemctl start mysql
sudo systemctl enable mysql

# Step 7: Secure MySQL Installation (Automated)
echo "Securing MySQL installation..."
ROOT_PASSWORD='YourSecurePass123!'
# Set root password and change authentication method to mysql_native_password
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$ROOT_PASSWORD'; FLUSH PRIVILEGES;"


echo "Running mysql_secure_installation non-interactively..."
sudo mysql -u root -p"$ROOT_PASSWORD" <<EOF
DELETE FROM mysql.user WHERE User='';
DROP DATABASE IF EXISTS test;
DELETE FROM mysql.db WHERE Db='test' OR Db='test_%';
FLUSH PRIVILEGES;
EOF

# Step 8: Creating a new database 
echo "Creating MySQL database..."
sudo mysql --user=root --password="$ROOT_PASSWORD" -e "CREATE DATABASE csye6225_db;"

# Step 9: Creating a new Linux group
echo "Creating Linux group..."
sudo groupadd csye6225_group -f

# Step 10: Creating a new Linux user and assigning to the group
USER_NAME="himanig"
echo "Creating user $USER_NAME and adding to group csye6225_group..."
if id "$USER_NAME" &>/dev/null; then
    echo "User $USER_NAME already exists, skipping creation..."
else
    sudo useradd -m -g $GROUP_NAME -s /bin/bash $USER_NAME
    echo "$USER_NAME:$DB_PASS" | sudo chpasswd
    echo "User $USER_NAME created successfully!"
fi

# Step 11: Creating application directory
APP_DIR="/opt/csye6225"
echo "Creating application directory at $APP_DIR..."
sudo mkdir -p $APP_DIR

# Step 12: Unzipping application (if exists)
APP_ZIP="/tmp/app.zip"
if [ -f "$APP_ZIP" ]; then
    echo "Unzipping application..."
    sudo unzip -o $APP_ZIP -d $APP_DIR
else
    echo "Application zip not found at $APP_ZIP, skipping unzip step..."
fi

# Step 13: Updating permissions for application directory
echo "Updating permissions for $APP_DIR..."
sudo chown -R $USER_NAME:$GROUP_NAME $APP_DIR
sudo chmod -R 750 $APP_DIR

echo "Setup completed successfully!"

