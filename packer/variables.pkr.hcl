variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "ami_users" {
  type    = list(string)
  default = ["123456789012"] # Replace with actual AWS account ID(s)
}

variable "instance_type" {
  type    = string
  default = "t2.micro"
}

variable "source_ami" {
  type    = string
  default = "ami-04b4f1a9cf54c11d0"
}

variable "mysql_database" {
  type    = string
  default = "mydatabase"
}

variable "mysql_user" {
  type    = string
  default = "myuser"
}

variable "mysql_password" {
  type    = string
  default = "mypassword"
}

variable "app_port" {
  type    = string
  default = "8080"
}

variable "repository_url" {
  type    = string
  default = "https://github.com/yourrepo.git"
}

variable "node_version" {
  type    = string
  default = "20.x"
}

variable "ssh_username" {
  type    = string
  default = "ubuntu"
}

variable "project_name" {
  type    = string
  default = "csye6225"
}

# GCP-specific variables
variable "gcp_project_id" {
  type    = string
  default = "your-gcp-project-id"
}

variable "gcp_zone" {
  type    = string
  default = "us-east1-d"
}


variable "machine_type" {
  type    = string
  default = "n1-standard-1"
}