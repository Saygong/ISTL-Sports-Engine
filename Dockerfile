FROM alpine:3.23.2

# Update the package index and upgrade existing system packages for security reasons
RUN apk update && apk upgrade

# Install the rbenv essential tools and download the rbenv-installer script
RUN apk add git curl bash && \
    curl -fsSL https://github.com/rbenv/rbenv-installer/raw/HEAD/bin/rbenv-installer | bash

# Configure your shell environment so that rbenv and Ruby shim are available in your PATH
ENV PATH="$PATH:/root/.rbenv/bin"
ENV PATH="$PATH:/root/.rbenv/shims"

# Optional: Verification step to ensure rbenv is configured correctly
# RUN curl -fsSL https://github.com/rbenv/rbenv-installer/raw/HEAD/bin/rbenv-doctor | bash

# Install the C compiler and headers (zlib, yaml, etc.) needed to build Ruby and the native gems.
# Then build Ruby 3.4.8 and install the Bundler gem.
RUN apk add build-base openssl-dev libffi-dev yaml-dev zlib-dev tzdata graphviz && \
    rbenv install 3.4.8 && \
    rbenv global 3.4.8 && \
    gem install bundler

# Define the working directory inside the container and copy the application source code
WORKDIR /backend

# Install the Ruby gems specified in the Gemfile using Bundler
COPY Gemfile* .
COPY .ruby-version .
RUN bundle install

# ...
COPY . .

# Use the entrypoint script to manage service startup
ENTRYPOINT ["bash", "./entrypoint.sh"]