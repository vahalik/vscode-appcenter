#!/bin/bash

# This script sets the values required for the beta Extension

echo "Setting values for beta Extension"

json -I -f package.json -e "this.name='vscode-appcenter-beta'"
json -I -f package.json -e "this.publisher='AppCenterbeta'"
json -I -f package.json -e "this.displayName='App Center beta'"
json -I -f package.json -e "this.icon='images/icon-beta.png'"