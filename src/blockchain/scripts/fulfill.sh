#!/bin/bash
## 
## Enter a courrier to the shipment
##

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <ID>"
  exit 1
fi

id=$1

echo "SaveShip.deployed().then(instance => instance.fulfill($id));" | truffle console
