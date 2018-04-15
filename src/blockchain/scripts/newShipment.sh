#!/bin/bash
## 
## Create a new shipment from command line
##

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <ID> <cost>"
  exit 1
fi

id=$1
cost=$2

echo "SaveShip.deployed().then(instance => instance.newShipment($id, $cost)).then(shipment => console.log(shipment));" | truffle console
