packer {
  required_plugins {
    amazon = {
      version = ">=1.2.0"
      source  = "github.com/hashicorp/amazon"
    }
    # googlecompute = {
    #   version = ">= 1.0.0"
    #   source  = "github.com/hashicorp/googlecompute"
    # }
  }
}

source "amazon-ebs" "webapp_ami" {
  region        = var.aws_region
  instance_type = var.instance_type
  ami_users     = var.ami_users
  source_ami    = var.source_ami
  ssh_username  = var.ssh_username
  ami_name      = "${var.project_name}-aws-ami-{{timestamp}}"
}

# source "googlecompute" "gcp_webapp" {
#   project_id              = var.gcp_project_id
#   zone                    = var.gcp_zone
#   machine_type            = var.machine_type
#   source_image            = "ubuntu-2404-noble-amd64-v20250214"
#   source_image_family     = "ubuntu-2404-noble-amd64"
#   ssh_username            = var.ssh_username
#   disk_size               = 10
#   disk_type               = "pd-standard"
#   network                 = "default"
#   tags                    = ["csye6225"]
#   image_name              = "${var.project_name}-gcp"
#   image_project_id        = var.gcp_project_id
#   image_description       = "Custom Ubuntu 20.04 server image"
#   image_storage_locations = ["us"]
#   image_family            = "csye6225-custom"
#   credentials_file        = var.credentials_file

# }
