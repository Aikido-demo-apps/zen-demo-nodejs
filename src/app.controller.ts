import { Controller, Get, Head, Header, UseInterceptors } from '@nestjs/common';
import { Public } from './decorators/public';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {

  applicationConfig = {
      baseUrl: "https://google.com/",
      appSecret: "&6FVphQ@6a",
      userId: 22,
  };

  @Head()
  @Public()
  @ApiExcludeEndpoint()
  @Header('Content-Type', 'text/plain')
  @Header('Server', 'Apache/2.4.6 (CentOS) PHP/5.4.16')
  handleHeadRequest() {
    return;
  }

  @Get('appspec.yml')
  @Public()
  @Header('Content-Type', 'text/plain')
  @Header('Server', 'Apache/2.4.6 (CentOS) PHP/5.4.16')
  @ApiExcludeEndpoint()
  handleAppSpec() {
    const file = `
    version: 0.0
    os: linux
    files:
      - source: /index.html
        destination: /var/www/html/
    `
    

    return file;
  }

  @Get('v1/metadata')
  @Public()
  @Header('Content-Type', 'text/plain')
  @Header('Server', 'Apache/2.4.6 (CentOS) PHP/5.4.16')
  @ApiExcludeEndpoint()
  handleAWSECSMetadata() {
    const file = `
    {
      "Cluster": "my-cluster-name",
      "TaskARN": "arn:aws:ecs:us-east-1:123456789012:task/my-cluster-name/abcd1234efgh5678",
      "Family": "my-task-definition",
      "Revision": "1"
    }
    `

    return file;
  }

  @Get('graphiql')
  @Public()
  @Header('Content-Type', 'text/plain')
  @Header('Server', 'Apache/2.4.6 (CentOS) PHP/5.4.16')
  @ApiExcludeEndpoint()
  handleGraphiQLEndpoint() {
    const file = `
GraphQL Playground
    `
    return file;
  }

  @Get('Dockerrun.aws.json')
  @Header('Content-Type', 'text/plain')
  @Header('Server', 'Apache/2.4.6 (CentOS) PHP/5.4.16')
  @Public()
  @ApiExcludeEndpoint()
  handleDockerrunFile() {
    const file = `
    {
      "AWSEBDockerrunVersion": 2,
      "volumes": [
        {
          "name": "php-app",
          "host": {
            "sourcePath": "/var/app/current/php-app"
          }
        },
        {
          "name": "nginx-proxy-conf",
          "host": {
            "sourcePath": "/var/app/current/proxy/conf.d"
          }
        }
      ],
    }
    `

    return file;
  }

  @Get('.git/config')
  @Header('Content-Type', 'text/plain')
  @Header('Server', 'Apache/2.4.6 (CentOS) PHP/5.4.16')
  @Public()
  @ApiExcludeEndpoint()
  handleGitConfigFile() {
    const file = `
    [core]
    `

    return file;
  }

  @Get('debug/vars')
  @Header('Content-Type', 'text/plain')
  @Header('Server', 'Apache/2.4.6 (CentOS) PHP/5.4.16')
  @Public()
  @ApiExcludeEndpoint()
  handleGolangDebugVars() {
    const file = `
    {
      "allocs": 4294967296,
      "goroutines": 3,
      "heap": {
        "alloc": 2147483648,
        "sys": 3145728000,
        "idle": 1024,
        "inuse": 2048
      },
      "memstats": {
        "alloc": 2342342342,
        "total_alloc": 5454545454,
        "sys": 2323232323,
        "heap_inuse": 2323232323,
        "heap_idle": 0,
        "heap_sys": 123123123,
        "heap_objects": 45678,
        "gc_cpu_fraction": 0.02,
        "gc_pause_ns": 1000000,
        "num_gc": 5
      }
    }
    `

    return file;
  }



  @Get('server-info')
  @Header('Content-Type', 'text/plain')
  @Public()
  @ApiExcludeEndpoint()
  handleServerInfo() {
    const file = `
    Apache Server Status for example.com (via 127.0.0.1)
    
    Server Version: Apache/2.4.46 (Ubuntu)
    Server Built:   Oct  1 2020 13:12:54
    Server Uptime:  1 hour 30 minutes 20 seconds
    Total Accesses: 1253
    Total Traffic:  1.2 GB
    CPU Usage:      0.01% (1.5 CPUs)
    CPULoad:        0.01
    Uptime:         5400 seconds
    ReqPerSec:      0.23
    BytesPerSec:    1288.3
    BytesPerReq:    5533.0
    BusyWorkers:    4
    `
    
    return file;
  }

  @Get('.circleci/config.yml')
  @Public()
  @Header('Content-Type', 'text/plain')
  @ApiExcludeEndpoint()
  getCircleCiConfig() {

    const file = `
    version: 2.1

    aliases:
      - &base_image
        - image: cimg/base:2024.10
    
    orbs:
      aws-cli: circleci/aws-cli@3.1.3
    
    jobs:
      checkout_code:
        docker: *base_image
        resource_class: medium
        steps:
          - run: mkdir -p ~/.ssh && ssh-keyscan -H github.com >> ~/.ssh/known_hosts
          - run: git clone --depth 1 "$CIRCLE_REPOSITORY_URL" --branch "$CIRCLE_BRANCH" .
          - save_cache:
              key: sourcecode-{{ .Revision }}
              paths:
                - .
    
    workflows:
      default_pipeline:
        jobs:
          - checkout_code
    `;

    return file;
  }

  @Get('.htaccess')
  @Public()
  @Header('Content-Type', 'text/plain')
  @ApiExcludeEndpoint()
   getConfigFile() {
    const file = `
    ServerRoot "/usr"
    Listen 80

    <IfModule dir_module>
        DirectoryIndex index.html
    </IfModule>

    #
    # The following lines prevent .htaccess and .htpasswd files from being 
    # viewed by Web clients. 
    #
    <FilesMatch "^\.([Hh][Tt]|[Dd][Ss]_[Ss])">
        Order allow,deny
        Deny from all
        Satisfy All
    </FilesMatch>

    Include /private/etc/apache2/other/*.conf
`

    return file;
  }
}
