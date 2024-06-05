Nodejs-HallBooking
Note: Post Request is accessible when loaded the files in local server and using Postman app

Github Repository URL
    -> https://github.com/Vimalnash/hall-booking.git



GET- RoomsList

    API URL     => http://localhost:8080/roomslist

    On Success  => Will fetch all the rooms list of Master data

    On Failure  => Will return Error Message



// 1. Create Room/Hall
POST Request

    Use Postman application to post the data and check

    Input Format=>http://localhost:8080/createroom/150/waterbottles,WesternToiltet/200

    API URL     => http://localhost:8080/createroom/:seatCapacity/:amenities/:pricePerHour
                => Give amenities in comma separated without spaces.

    On Success  => Will Create a New HallRoom with the mentioned datas

    On Failure  => Will return Error Message



// 2. Booking a Room
POST Request

    Use Postman application to post the data and check

    Input Format    => http://localhost:8080/createRoomBooking/1/2024-05-25/20:24/21:00/1

    API URL         => http://localhost:8080/createRoomBooking/:customerId/:date/:startTime/:endTime/:roomId

    Date => Format      => yyyy-mm-dd => 2024-05-25, Should be today or Future Date only

    Time => Format      => 24 Hour Format => e.g.: 14:00,

    If Today Booking    
        => StartTime should be greater than Current time,
        => EndTime should be greater than StartTime,
        => Cannot save in the time duration if Already booked for the mentioned roomId

    For Future Date     => Cannot save in the time duration if Already booked for the mentioned roomId

    On Success          => Will Create a New roombooking with the mentioned datas

    On Failure          => Will return Error Message



// 3. List All Rooms with Booked Data
GET Request

    API URL     => http://localhost:8080/rooms/bookeddata

    On Success  => Will fetch all the rooms list with their booked details

    On Failure  => Will return Error Message



// 4. List All Customer with Booked Data
GET Request

    API URL     => http://localhost:8080/customers/bookeddata

    On Success  => Will fetch all the Customers list with their booked details

    On Failure  => Will return Error Message



// 5. List how many times a customer has booked the room with below details
GET Request
    A Customer Booked History

    Input Format=>http://localhost:8080/customerhistory/1

    API URL     => http://localhost:8080/customerhistory/customerId
                => replace customerId with the available customer list -> Check index.js for customerDetails

    On Success  => Will fetch all the rooms list with their booked details for the particular customer id mentioned in the URL

    On Failure  => Will return Error Message