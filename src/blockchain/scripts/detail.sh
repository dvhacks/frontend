#!/bin/bash
## 
## Create a new shipment from command line
##

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <ID>"
  exit 1
fi

id=$1

echo "SaveShip.deployed().then(instance => instance.shipments($id)).then(shipment => console.log(shipment));" | truffle console
