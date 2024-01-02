# Use images from ECR Public Gallery (gallery.ecr.aws)
# Otherwise you run the risk of failure due to rate limiting
FROM public.ecr.aws/amazonlinux/amazonlinux:2

 USER root
 # Add node repo
 RUN curl -sL https://rpm.nodesource.com/setup_16.x | bash -

# Add common tools
RUN yum -q -y clean all && \
    yum update -q -y && \
    yum install -q -y jq zip unzip tar gzip nodejs python3 git && \
    yum -q -y clean all && \
    yum install -q -y yum-utils && \
    yum install -q -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm


# Add latest aws-cli
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install && \
    rm -rf awscliv2.zip ./aws

# Install Docker
RUN yum-config-manager --enable epel
RUN amazon-linux-extras install docker

# Add yq
RUN curl https://github.com/mikefarah/yq/releases/download/v4.7.0/yq_linux_amd64 -sfLo /usr/bin/yq && \
    chmod +x /usr/bin/yq


# Fix alias for python3 & pip3
RUN ln -s /usr/bin/pip3 /usr/bin/pip

# Install Git Remote CodeCommit
RUN pip install git-remote-codecommit

ADD . /src
WORKDIR /src

ENTRYPOINT ["/src/.factory/go.sh"]
