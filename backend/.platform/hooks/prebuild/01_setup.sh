hooks:
  prebuild:
    01_prisma_generate.sh:
      mode: "000755"
      owner: root
      group: root
      content: |
        #!/bin/bash
        set -e
        cd /var/app/staging
        npm run prisma:generate
        
    02_build.sh:
      mode: "000755"
      owner: root
      group: root
      content: |
        #!/bin/bash
        set -e
        cd /var/app/staging
        npm run build
        
  predeploy:
    01_prisma_migrate.sh:
      mode: "000755"
      owner: root
      group: root
      content: |
        #!/bin/bash
        set -e
        cd /var/app/staging
        npm run prisma:migrate:deploy
        
    02_prisma_seed.sh:
      mode: "000755"
      owner: root
      group: root
      content: |
        #!/bin/bash
        cd /var/app/staging
        npm run prisma:seed || true
