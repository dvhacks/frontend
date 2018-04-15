#!/bin/bash
## 
## Enter a courrier to the shipment
##

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <ID> <cost>"
  exit 1
fi

id=$1
cost=$2

echo "SaveShip.deployed().then(instance => instance.enterCourrier($id, { value: $cost }));" | truffle console
