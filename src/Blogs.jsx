import React, { useEffect, useRef, useState } from 'react'
import { Box, Container, VStack, Button, Input, HStack, Image, Heading } from '@chakra-ui/react'
import Message from './Message'
import { onAuthStateChanged, getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { app } from './firebase';
// import { setUserId } from 'firebase/analytics';
import { getFirestore, addDoc, collection, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore";
// import { async } from '@firebase/util';

const auth = getAuth(app);

const db = getFirestore(app);

const loginHandler = () => {
    const googleProvider = new GoogleAuthProvider();

    signInWithPopup(auth, googleProvider)
}

const logoutHandler = () => {
    signOut(auth)
}


const Blogs = () => {
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const divForScroll = useRef(null);




    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            setMessage("");

            await addDoc(collection(db, "Messages"), {

                text: message,
                uid: user.uid,
                uri: user.photoURL,
                createdAt: serverTimestamp()
            })

            divForScroll.current.scrollIntoView({ behaviour: "smooth" })
        } catch (error) {
            alert(error)

        }

    }


    useEffect(() => {
        const q = query(collection(db, "Messages"), orderBy("createdAt", "asc"));

        const unSubscribe = onAuthStateChanged(auth, (data) => {
            setUser(data);
        })
        const unsubscribeForMessage = onSnapshot(q, (snap) => {
            console.log(snap.docs);
            setMessages(
                snap.docs.map((item) => {
                    const id = item.id;
                    return { id, ...item.data() };
                }));
        });

        return () => {
            unSubscribe();
            unsubscribeForMessage();
        };


    }, [])

    return <Box bg={"red.50"}>
        {
            user ? (
                <Container h={"100vh"} bg={"white"}>

                    <VStack h={"full"} paddingY={"4"} >
                        <Button onClick={logoutHandler} w={"full"} colorScheme={"red"}>
                            Logout
                        </Button>

                        <VStack h={"full"} w={"full"} overflowY="auto" css={{
                            "&::-webkit-scrollbar": {
                                display: "none",
                            }
                        }}>
                            {
                                messages.map(item => (
                                    <Message key={item.id} text={item.text} uri={item.uri} user={item.uid === user.uid ? "me" : "other"} />
                                )
                                )
                            }
                            <div ref={divForScroll}></div>

                        </VStack>


                        <form onSubmit={submitHandler} style={{ width: "100%" }}>

                            <HStack>

                                <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Enter a Message.....' />


                                <Button colorScheme={"purple"} type='submit'>Send</Button>
                            </HStack>

                        </form>
                    </VStack>

                </Container>
            ) : <VStack alignItems={"center"} justifyContent={"center"} h={"100vh"} bg={"telegram.100"}>
                <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' bg={"telegram.100"}>
                    <Heading>
                        Roommates...!
                    </Heading>
                    <Image boxSize='300px' src='https://pps.whatsapp.net/v/t61.24694-24/149370752_988121255472957_3953461227736932075_n.jpg?ccb=11-4&oh=01_AVwj7ZZSqORutzPncXBcNiX7gRka55A0QXjQin3S2Us0sw&oe=62EC3E52' alt='Dan Abramov' />


                </Box>
                <Button onClick={loginHandler} colorScheme={"purple"}>Sign in with google</Button>


            </VStack>
        }

    </Box>
}

export default Blogs