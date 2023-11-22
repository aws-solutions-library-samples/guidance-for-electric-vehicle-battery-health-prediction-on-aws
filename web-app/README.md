# Smart Battery Manager

---

## Prerequisites

* Node >= ^14.15.0 || ^16.10.0
* npm >= 8.15.0


## How to use

### Configuration
1. Amplify config: `environment` contains the env variables that amplify **needs**.
    1. Fill in the parameters needed for your project. 
       * If using locally you only need `NG_APP_API`, for env lazy load.
           When tested: **Revert changes from `environment` file **
    2. Add `example.com` to your hosts file.  
       On mac/linux, edit /etc/hosts and add the following line:
       ```
       127.0.0.1       example.com
       ```
       Open **angular.json** and add the host and port at below shown path
        ```
       "projects": {
            "ng-app": {
                "architect": {
                    "serve:: {
                        "options": {
                           "host": "example.com",
                           "port": 4200
                        }
                    }
                }
            }
       }
   3. `CUSTOMER_NAME` and `CUSTOMER_LOGO` env variables are supplied from node process. To set up these env variable you could 
      1. Run `export CUSTOMER_NAME=Test` and `export CUSTOMER_LOGO=https://....`
      2. Rename `.env.template` to `.env` and provide it in `.env` file.
      
#### <u>Note: DO NOT PUSH CHANGES TO `environment.ts`, `environment.prod.ts`, and `angular.json`</u>

### Run
```
npm install
npm start
```

---

## Packages used

Your project might need additional packages.    
The packages chosen are very commonly used and are necessary for most if not all prototypes.

### Fontawesome - [docs](https://fontawesome.com/v5/docs/web/use-with/angular)

### Amplify - [docs](https://docs.amplify.aws/start/q/integration/react)
