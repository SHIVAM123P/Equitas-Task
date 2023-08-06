import React, { useState, useEffect } from "react";
import "./App.css";

import Launches from "./components/Launches";
// import { Button, Container } from "@mui/material";
import {
    Button,
    Container,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Typography,
} from "@mui/material";
import moment from "moment";
import "moment-timezone";
import CircularProgress from "@mui/material/CircularProgress";

function App() {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const apiUrl = "https://api.spacexdata.com/v4/launches/query";

    //Added this function to getRandomImage from the fliker_images array
    const getRandomImage = (images) => {
        const randomIndex = Math.floor(Math.random() * images.length);
        return images[randomIndex];
    };
    function getQueryBody(pageNumber) {
        return {
            query: {
                upcoming: false,
                success: true,
            },
            options: {
                page: pageNumber,
                select: {
                    id: 1,
                    name: 2,
                    links: 3,
                    date_utc: 4,
                    flight_number: 5,
                },
                populate: [
                    {
                        path: "rocket",
                        select: {
                            id: 1,
                            name: 2,
                            type: 3,
                            description: 4,
                            height: 5,
                            diameter: 6,
                            mass: 7,
                            flickr_images: 8,
                        },
                    },
                    {
                        path: "crew",
                        select: {
                            id: 1,
                            name: 2,
                            agency: 3,
                            image: 4,
                        },
                    },
                    {
                        path: "payloads",
                        select: {
                            id: 1,
                            name: 2,
                            type: 3,
                            orbit: 4,
                            reference_system: 5,
                            regime: 6,
                        },
                    },
                    {
                        path: "capsules",
                        select: {
                            id: 1,
                            type: 2,
                            status: 3,
                            serial: 4,
                        },
                    },
                    {
                        path: "launchpad",
                        select: {
                            id: 1,
                            name: 2,
                            full_name: 3,
                            locality: 4,
                            region: 5,
                            latitude: 6,
                            longitude: 7,
                            details: 8,
                        },
                    },
                ],
                sort: {
                    flight_number: "desc",
                },
            },
        };
    }

    const fetchData = async (pageNumber) => {
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(getQueryBody(pageNumber)),
            });

            if (!response.ok) {
                console.log("Network response was not ok");
            }

            const responseData = await response.json();
            console.log(responseData);
            setData(responseData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData(currentPage);
    }, []);

    const nextPage = () => {
        setCurrentPage(currentPage + 1);
        fetchData(currentPage + 1);
    };
    const prevPage = () => {
        setCurrentPage(currentPage - 1);
        fetchData(currentPage - 1);
    };

    return (
        <div >
            <Container id="container" >
                {/* Total Launches */}
                <Typography
                    variant="h4"
                    style={{
                        fontWeight: 'bold',
                        margin: '20px 0px -30px 0',
                        color: '#333',
                        textAlign: 'center',
                    }}
                >
                    Total Launches: {data['totalDocs']}
                </Typography>
                {data['docs'] ? (
                    <div>
                        {/* Grid */}
                        <Grid container spacing={4} id="grid" style={{ margin: '20px 0' }}>
                            {data['docs'].map((launch) => (
                                <Grid key={launch.id} item xs={12} sm={6} md={4} lg={3}>
                                    {/* Card */}
                                    <Card
                                        id="card"
                                        style={{
                                            height: '100%',
                                            border: '1px solid #ccc',
                                            backgroundColor: '#f0f0f0',
                                            borderRadius: '15px',
                                            
                                        }}
                                    >
                                        {/* CardHeader */}
                                        <CardHeader
                                            id="cardheader"
                                            titleTypographyProps={{
                                                variant: 'h6',
                                                style: {
                                                    fontWeight: 'bold',
                                                    whiteSpace: 'nowrap', // Prevent title from wrapping to the next line
                                                    overflow: 'hidden', // Hide overflow text
                                                    textOverflow: 'ellipsis', // Show ellipsis (...) when text overflows
                                                },
                                            }}
                                            title={launch.name.length > 28 ? `${launch.name.slice(0, 12)}...` : launch.name} // Show only the first 12 characters of the title
                                        />
                                        {/* CardContent */}
                                        <CardContent
                                            id="cardcontent"
                                            style={{
                                                padding: '0 5px 3px 5px', // Add padding to the card content
                                                transition: 'background-color 0.3s ease', // Smooth transition for background color change
                                                '&:hover': {
                                                    backgroundColor: '#e0e0e0', // Change background color on hover
                                                },
                                            }}
                                        >
                                            {/* Card Image */}
                                            <img
                                                src={getRandomImage(launch.rocket.flickr_images)}
                                                alt="Launch"
                                                style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '15px' }} // Set image properties and add rounded corners
                                            />
                                            {/* Launch Date */}
                                            <Typography variant="body2" style={{ margin: '10px' }}>
                                                Date: {moment.utc(launch.date_utc).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss')}
                                            </Typography>
                                            {/* Launch Pad */}
                                            <Typography variant="body2">Launch Pad: {launch.launchpad.name}</Typography>
                                            {/* Flight Number */}
                                            <Typography variant="body2">Flight Number: {launch.flight_number}</Typography>
                                            {/* Watch Launch Video Button */}
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                href={launch.links.webcast}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ marginTop: '10px' }} // Add margin at the top
                                            >
                                                Watch Launch Video
                                            </Button>
                                            {/* Read More on Wikipedia Button */}
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                href={launch.links.wikipedia}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ margin: '10px 0 7px 0' }} // Add margin at the top and bottom, and no margin on the sides
                                            >
                                                Read More on Wikipedia
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        {/* Pagination */}
                        <div
                            id="pagination"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: '20px', // Add margin at the top
                            }}
                        >
                            <Typography
                                variant="h6"
                                style={{
                                    fontWeight: 'bold',
                                    color: '#333',
                                    marginRight: '20px', // Add margin on the right side
                                }}
                            >
                                Page {data['page']} / {data['totalPages']}
                            </Typography>
                            {/* Prev Page Button */}
                            <Button
                                id="prevbtn"
                                variant="outlined"
                                color="primary"
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                style={{
                                    margin: '10px', // Add margin to the button
                                    transition: 'all 0.3s ease', // Smooth transition for button scale
                                    '&:hover': {
                                        transform: 'scale(1.1)', // Scale up the button on hover
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Add subtle box shadow on hover
                                    },
                                }}
                            >
                                Prev Page
                            </Button>
                            {/* Next Page Button */}
                            <Button
                                id="nextbtn"
                                variant="outlined"
                                color="secondary"
                                onClick={nextPage}
                                disabled={currentPage === data['totalPages']}
                                style={{
                                    margin: '10px', // Add margin to the button
                                    transition: 'all 0.3s ease', // Smooth transition for button scale
                                    '&:hover': {
                                        transform: 'scale(1.1)', // Scale up the button on hover
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Add subtle box shadow on hover
                                    },
                                }}
                            >
                                Next Page
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div
                        id="loadbtn"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '200px', // Set a minimum height for the container
                            marginTop: '20px', // Add margin at the top
                        }}
                    >
                        <CircularProgress color="primary" />
                    </div>
                )}
            </Container>


        </div>
    );
}
export default App;
