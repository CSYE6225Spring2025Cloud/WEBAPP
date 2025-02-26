variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "ami_users" {
  type    = list(string)
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
  type = string
}

variable "mysql_user" {
  type = string
}

variable "mysql_password" {
  type = string
}

variable "app_port" {
  type    = string
  default = "8080"
}

variable "repository_url" {
  type = string
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
  type        = string
  description = "Your Google Cloud Project ID."
}

variable "gcp_zone" {
  type    = string
  default = "us-east1-d"
}


variable "machine_type"{
  type        = string
  default     = "n1-standard-1"
}