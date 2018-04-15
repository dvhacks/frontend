pragma solidity ^0.4.21;
// We have to specify what version of compiler this code will compile with

contract SaveShip {

    enum State {Created, Pending, InProgress, Fulfilled, Rejected}

    struct Shipment {
        uint id;
        address sender;
        address recipient;
        address courrier;
        uint cost;
        State state;
    }

    mapping(uint => Shipment) public shipments;

    event Created(uint);
    event Aborted(uint);
    event Fulfilled(uint);

    /// Create a SaveShip shipment for a cost
    function newShipment(uint _id, uint _cost) public returns(uint) {
        emit Created(_id);
        shipments[_id] = Shipment({
            id: _id,
            sender: msg.sender,
            // temporary placeholder
            recipient: msg.sender,
            // temporary placeholder
            courrier: msg.sender,
            cost: _cost,
            state: State.Created
        });
        return shipments[_id].id;
    }

    /// Pay for the shipment into escrow
    function enterRecipient(uint _id) public payable {
        require(shipments[_id].state == State.Created);
        require(msg.value == shipments[_id].cost);

        shipments[_id].recipient = msg.sender;
        shipments[_id].state = State.Pending;
    }

    /// Pay insurance of the package into escrow
    function enterCourrier(uint _id) public payable {
        require(shipments[_id].state == State.Pending);
        require(msg.value == shipments[_id].cost);
        // TODO this should be true
//        require(msg.sender != shipments[_id].recipient)

        shipments[_id].courrier = msg.sender;
        shipments[_id].state = State.InProgress;
    }

    function abort(uint _id) public {
        require(shipments[_id].state == State.Pending || shipments[_id].state == State.InProgress || shipments[_id].state == State.Rejected);

        emit Aborted(_id);

        shipments[_id].state = State.Rejected;

        shipments[_id].recipient.transfer(shipments[_id].cost);
        shipments[_id].courrier.transfer(shipments[_id].cost);
    }

    function fulfill(uint _id) public {
        require(shipments[_id].state == State.InProgress);

        emit Fulfilled(_id);

        shipments[_id].state = State.Fulfilled;

        shipments[_id].sender.transfer(shipments[_id].cost);
        shipments[_id].courrier.transfer(shipments[_id].cost);
    }
}