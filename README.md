# bunny-test 

## What did I use? 
* Frontend: VueJS
* Backend: ExpressJS (both microservices)
* Database: Firebase (an independent database for each microservice)

## Wanna see the app working? :)
[Click to watch the video](https://drive.google.com/file/d/1pXDWDT-dImUF8u_TGKVyf1oAIoDCB_Iv/view?usp=sharing) 

## Live server running 
[http://181.135.251.250:8080/](http://181.135.251.250:8080/) 

## Diagram
![Diagram](https://raw.githubusercontent.com/jdavidavendano/bunny-test/master/img/Diagram.png)

## Future work: 
* Gateway API for the microservices, maybe using a load balancer such as nginx or consul.
* Each service in a Docker container. 
* Delete tasks when the "father user" is deleted. 

## To run the code:
1. Open 3 terminals 
2. In one of them type 
``` 
cd users-microservice
npm i
npm run build
```
2. In other type 
``` 
cd tasks-microservice
npm i
npm run build
```
3. In the last one
```
cd front-end
npm i
npm run serve
```

## Note:
I let the firebase credentials in the repository for testing purposes. 
