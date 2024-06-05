import express from "express";

// Initializing express
const app = express();

// Setting PORT
const PORT = 8080;

// middleware
app.use(express.json());

// Hall Rooms Data
let hallRooms = [
    {_id:1, createdDate:"2024-05-01", roomName: 101, seatCapacity: 10, amenities:["WaterHeater", "AirCooler"], pricePerHour: 100},
    {_id:2, createdDate:"2024-05-01", roomName: 102, seatCapacity: 5, amenities:["WaterHeater", "AirCooler"], pricePerHour: 50}
];

// Rooms Already Booked Data
let roomBooked = [
    {_id:1, orderedDate:"2024-05-25", bookingStatus:"completed", room_id: 1,
        customerid: 1, 
        roomOccupyFromDate: "2024-06-15", startTime:"10:00", 
        roomOccupyToDate: "2024-06-15", endTime:"12:00" 
    },
    {_id:2, orderedDate:"2024-05-25", bookingStatus:"completed", room_id: 2,
        customerid: 1, 
        roomOccupyFromDate: "2024-06-15", startTime:"10:00",
        roomOccupyToDate: "2024-06-15", endTime:"12:00" 
    },
    {_id:3, orderedDate:"2024-05-15", bookingStatus:"completed", room_id: 1,
        customerid: 2, 
        roomOccupyFromDate: "2024-06-15", startTime:"13:00", 
        roomOccupyToDate: "2024-06-15", endTime:"15:00" 
    }
];

// Customer Master Data
let customerDetails = [
    {_id:1, customerName: "Sam", phoneNo: 9888899999},
    {_id:2, customerName: "Kumar", phoneNo: 9999988888}
];


// 1. Create Room/Hall
let hallRoom_Id = 3;
app.post("/createroom/:seatCapacity/:amenities/:pricePerHour", (req, res) => {
    const newHallCreatedDate = new Date().toJSON().slice(0,10);
    const hallRoomsCount1 = hallRooms.length;
    try {
        if (req.params.seatCapacity == "" || req.params.amenities == "" || req.params.pricePerHour == "") {
            return res.status(400).json({error: "Error Inserting Data, Give Parameters Properly"});
        };

        const amenities = req.params.amenities.split(",")

        const newRoomData = {
            _id: hallRoom_Id ,
            createdDate: newHallCreatedDate,
            seatCapacity: parseInt(req.params.seatCapacity), 
            amenities,
            pricePerHour: parseInt(req.params.pricePerHour)
        };
        hallRooms.push(newRoomData);
        const hallRoomsCount2 = hallRooms.length;
        if (hallRoomsCount2 > hallRoomsCount1) {
            hallRoom_Id = hallRoom_Id + 1;
            return res.status(200).json({message: "Success Room Creation", data: newRoomData});
        };
 
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error"});
    }
});

// Get Rooms List
app.get("/roomslist", (req, res) => {
    const hallRoomsCount1 = hallRooms.length
    try {
        if(hallRoomsCount1 > 1) {
            return res.status(201).json({message:"All Rooms List", Data: hallRooms});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error"});
    }
});


// 2. Booking a Room
let roomBooked_id = 3;
app.post("/createRoomBooking/:customerId/:date/:startTime/:endTime/:roomId", (req, res) => {
    try {
        const roomOrderedDate = new Date().toJSON().slice(0,10);

        const date = new Date();
        const timeZone = 'Asia/Kolkata';
        const currentTime = new Intl.DateTimeFormat("en-IN", {timeStyle:"short", hour12:false, timeZone}).format(date);
        
        const roomBookingArray1 = roomBooked.length;
    
        // Checking customer id exists
        const bookingCustomer = customerDetails.filter((data) => {
            return data._id == req.params.customerId;
        });
    
        // Checking room id exists
        const roomno = hallRooms.filter((data) => {
            return data._id == req.params.roomId;
        });

        // Validating if customer id or room id not exists
        if (bookingCustomer.length == 0 || roomno.length == 0) {
            return res.status(404).json({error: "customerId or roomId not found"})
        }

        // Validating if any data is empty and return response
        if (req.params.customerId == "" || req.params.date == "" || req.params.startTime == "" || req.params.endTime == "" || req.params.roomno == "") {
            return res.status(400).json({error: "Error Saving, Need All Required Values. Check URL"});
        };

        // Validating Already room occupied / booked, today or future dates and time
        if ((req.params.date < roomOrderedDate)) {
            return res.status(400).json({error: "Booking Date Should be Today or Future Date Only "});
        }
        else if ((req.params.date == roomOrderedDate)) {
            if ((req.params.startTime < currentTime)) {
                return res.status(400).json({error: "StartTime should be greater than current time"});
            }
            else if ((req.params.endTime < req.params.startTime)) {
                return res.status(400).json({error: "EndTime should be greater than Start time"});
            } else {
                for (let i=0; i<roomBooked.length; i++) {
                    if((req.params.date == roomBooked[i].roomOccupyFromDate) && (req.params.roomId == roomBooked[i].room_id)) {
                        if(((req.params.startTime >= roomBooked[i].startTime) && (req.params.startTime <= roomBooked[i].endTime))) {
                            return res.status(400).json({error: "This Room Already Booked in the same Date and Time"});
                        }
                        else if ((req.params.startTime <= roomBooked[i].startTime) && (req.params.endTime >= roomBooked[i].startTime)) {
                            return res.status(400).json({error: `This Room Already Booked in the same Date and End Time to be Less than ${roomBooked[i].startTime}`});
                        }
                    }
                }
            }
            postData();
        }
        else if ((req.params.date > roomOrderedDate)) {
            for (let i=0; i<roomBooked.length; i++) {
                if((req.params.date == roomBooked[i].roomOccupyFromDate) && (req.params.roomId == roomBooked[i].room_id)) {
                    if(((req.params.startTime >= roomBooked[i].startTime) && (req.params.startTime <= roomBooked[i].endTime))) {
                        return res.status(400).json({error: "This Room Already Booked in the same Date and Time"});
                    }
                    else if ((req.params.startTime <= roomBooked[i].startTime) && (req.params.endTime >= roomBooked[i].startTime)) {
                        return res.status(400).json({error: `This Room Already Booked in the same Date and End Time Less than ${roomBooked[i].startTime}`});
                    }
                }
            }
            postData();
        };

        // Function for Posting Data
        function postData() {
            const newBookingData = {
                _id: roomBooked_id,
                orderedDate: roomOrderedDate,
                bookingStatus: "confirmed",
                room_id: roomno[0]._id,
                customerid: bookingCustomer[0]._id,
                roomOccupyFromDate: req.params.date,
                startTime: req.params.startTime,
                roomOccupyToDate: req.params.date,
                endTime: req.params.endTime
            };
            roomBooked.push(newBookingData);
            const roomBookingArray2 = roomBooked.length
            if (roomBookingArray2 > roomBookingArray1) {
                roomBooked_id = roomBooked_id + 1;
                return res.status(200).json({message:"Room Booking Success", BookedData: newBookingData});
            };
        };

    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error"});
    }
});


// 3. List All Rooms with Booked Data
// RoomName, BookedStatus, CustomerName, Date, StartTime, EndTime
app.get("/rooms/bookeddata", (req, res) => {
    try {
        let roomStatus = [];
        hallRooms.map(roomdata => {
            const roomwiseobj = {};
            const roomwise = roomBooked.filter(bookdeddata => {
                    return roomdata._id == bookdeddata.room_id;
                }).map((data) => {
                    const customerData = customerDetails.filter((custData) => {
                        return custData._id == data.customerid;
                    });
                    return {
                            BookingStatus: data.bookingStatus,
                            CustomerName: customerData[0].customerName,
                            OccupyDate:  data.roomOccupyFromDate,
                            StartTime: data.startTime,
                            EndTime: data.endTime
                        }
                });
            roomwiseobj[`RoomNo-${roomdata.roomName}`] = roomwise;
            roomStatus.push(roomwiseobj);
        });
        res.status(201).json({message: "RoomWise BookedDetails & Status", data: roomStatus});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error"});
    }
});

// 4. List All Customer with Booked Data
// CustomerName, RoomName, Date, StartTime, EndTime
app.get("/customers/bookeddata", (req, res) => {
    try {
        let customerStatus = [];
        customerDetails.map(customerdata => {
            const cutomerwisearray = {};
            const customerwise = roomBooked.filter(bookdeddata => {
                    return customerdata._id == bookdeddata.customerid;
                }).map((data, index) => {
                    const hallroomData = hallRooms.filter((hallData) => {
                        return hallData._id == data.room_id;
                    });
                    return {
                            RoomName: hallroomData[0].roomName,
                            OccupyDate:  data.roomOccupyFromDate,
                            StartTime: data.startTime,
                            EndTime: data.endTime
                        }
                });
            cutomerwisearray[`CustomerName-${customerdata.customerName}`] = customerwise;
            customerStatus.push(cutomerwisearray);
        });
        res.status(201).json({message: "CustomerWise BookedDetails", data: customerStatus});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error"});
    }
});


// 5. List how many times a customer has booked the room with below details
// Customer Booked History
// CustomerName, RoomName, Date, StartTime, EndTime, BookingId, BookingDate, BookingStatus
app.get("/customerhistory/:customerId", (req, res) => {
    try {
        const customerData = customerDetails.filter((data) => {
            return data._id == req.params.customerId;
        });
        let customerStatus = [];
        let cutomerwisearray = {};
        let roomwise = {};
        roomBooked.filter(bookdeddata => {
                return customerData[0]._id == bookdeddata.customerid
            }).map((data, index) => {
                const hallroomData = hallRooms.filter((hallData) => {
                    return hallData._id == data.room_id
                });
                if (hallroomData.length == 1){
                    if (!(roomwise[`RoomName-${hallroomData[0].roomName}`])) {
                        roomwise[`RoomName-${hallroomData[0].roomName}`] = [];
                    }
                    roomwise[`RoomName-${hallroomData[0].roomName}`].push({
                        RoomName: hallroomData[0].roomName,
                        OccupyDate:  data.roomOccupyFromDate,
                        StartTime: data.startTime,
                        EndTime: data.endTime,
                        BookingId: data._id,
                        BookingDate: data.orderedDate,
                        BookingStatus: data.bookingStatus
                    })
                };
            });
        cutomerwisearray[`CustomerName-${customerData[0].customerName}`] = roomwise;
        customerStatus.push(cutomerwisearray);
        res.status(201).json({message: "CustomerWise BookedDetails", data: customerStatus});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error"});
    }
});


// Activating Server and Listening to PORT
app.listen(PORT, () => {
    console.log(`
    Server Started at PORT : ${PORT},
    Listening to http://localhost:${PORT}
    `);
});