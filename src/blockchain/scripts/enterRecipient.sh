#!/bin/bash
## 
## Enter a recipient to the shipment
##

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <ID> <cost>"
  exit 1
fi

id=$1
cost=$2

echo "SaveShip.deployed().then(instance => instance.enterRecipient($id, { value: $cost }));" | truffle console
