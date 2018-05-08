## Installation Instructions
```
This is a docker file that take an image from alpine linux and create a lamp stack
```

### A. Pull all images to your server.

1. docker pull milenium1/alpine-lamp
2. docker pull milenium1/alpine-laravel
3. docker pull milenium1/alpine-nodejs
4. docker pull milenium1/alpine-react




### B. Clone the api repo here 
```  
git clone https://github.com/Sealcharles/compilebox.git
```

### C. Rename the sample.env file to .env
The dafult port is set to 3000, but yo can change it to any port you want

### D. install the required dependencies,  
```
cd compilebox
npm install 
```

### E. Start the server

```
node index.js
```

### F. Sample Request and endpoints 

1. Open postman on localhost:3000/api/1.0
2. Set the request as a POST request
3. The following parameters are required for the api to work:

/**
   * @param {*} user_id: User Id
   * @param {*} language:container_name
   * @param {*} mode_mvc: Action needed a cpntainer to perform. e,g "start, stop or restart"
   * @param {*} port_1: docker container port
   * @param {*} port_2: host port
   * @param {*} unique_id: the id of the container we reference that when we want to destroy it. And to reference the                              storage later. this is the unique id of the container for general reference
   * @param {*} mvc_ex_id:i dont really underatand this
   * @param {*} right_answer
   * @param {*} image_name ['milenium1/alpine-react', 'milenium1/alpine-nodejs', 'milenium1/alpine-laravel', 'milenium1/alpine-lamp']
   * @param {*} ex_id
*/


### G. Before you can be able to use the "start", "stop" or "restart" in your mvc_mode parameter, you have to run your containers first.

To run your containers, the parameters you will be passing varies for each of them
For Lamp Container:
    /**
   * @param {*} user_id: 001
   * @param {*} language: lamp
   * @param {*} mode_mvc: run
   * @param {*} port_1: 80
   * @param {*} port_2: 80
   * @param {*} unique_id: 001
   * @param {*} mvc_ex_id: 001
   * @param {*} right_answer: yes
   * @param {*} image_name: milenium1/alpine-lamp 
   * @param {*} ex_id
   * @param {*} volume_path 
   * @param {*} app_path
*/



```
docker run -d -v /path/to/project:/var/www/localhost/htdocs/ -e MYSQL_ROOT_PASSWORD=password -p 80:80 -p 3306:3306 --name lamp milenium1/alpine-lamp
```

### Connect to MariaDB
```
mysql -u root -p -h 127.0.0.1
```


## Troubleshooting
If you get a "forbidden error 403"
in your project run:
```
sudo chmod -Rf 755 /path/to/project
``` 
If missing some lib for php please let me know or create a pull request
