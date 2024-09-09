---
layout: post
title: Using lazydocker with SSH-based remote contexts
date: 2024-08-24
tags:
  - docker
  - shell
---
A quick hack to work around the current issue with `lazydocker` and SSH-based remote Docker context definitions.

I've used the excellent [lazydocker](https://github.com/jesseduffield/lazydocker) before, but only occasionally, reverting to the `docker` CLI for most of my monitoring work. I thought I'd start using it again and learn more about it. While I can (and have) run `lazydocker` [as a Docker container](https://github.com/jesseduffield/lazydocker?tab=readme-ov-file#docker) I wanted to run it locally in the Linux container of my Chromebook and connect remotely to my Docker engines running on various machines.

> If you are going to run `lazydocker` [as a Docker container](https://github.com/jesseduffield/lazydocker?tab=readme-ov-file#docker) then I recommend you build the image yourself (the `Dockerfile` is in the repo) as the [image on DockerHub](https://hub.docker.com/r/lazyteam/lazydocker) is rather out of date.

I manage these remote engines via [Docker contexts](https://docs.docker.com/engine/manage-resources/contexts/). Running `docker context ls` here shows me this:

```log
NAME         DESCRIPTION                               DOCKER ENDPOINT               
default      Current DOCKER_HOST based configuration   unix:///var/run/docker.sock   
docker *     Docker Host on PVE LXC                    ssh://dj@docker               
homeops      Docker Host on homeops                    ssh://dj@homeops              
kkhw42xrfy   M2 Air                                    ssh://user@kkhw42xrfy      
synology     Docker Host on Synology NAS               ssh://dj@synology
```

> If you're interested in finding out how to define and use these contexts, see the post [Remote access to Docker on my Synology NAS](/blog/posts/2021/06/12/remote-access-to-docker-on-my-synology-nas/).

Currently there are some issues with `lazydocker` correctly using the SSH-based remote addresses - see for example [issue 510](https://github.com/jesseduffield/lazydocker/issues/510) which, while closed, describes exactly what I experience even with the latest release, [as does another user](https://github.com/jesseduffield/lazydocker/pull/511#issuecomment-2139493861). I have no doubt that this will be sorted soon, but in the meantime I decided to set up a workaround, based on the fact that the `DOCKER_HOST` environment variable is correctly evaluated (see [feat(docker): Honor the host specified in current docker context](https://github.com/jesseduffield/lazydocker/pull/464)) even if the host info in the context is not.

If my context is set to `docker`, for example, like this:

```shell
docker context set docker
```

then if I start `lazydocker` I get an error:

_Docker event stream returned error: error during connect: Get "http://dj%40docker/v1.25/events": dial tcp: lookup dj@docker: no such host_

However, if I set `DOCKER_HOST` before the invocation, like this:

```shell
DOCKER_HOST=ssh://dj@docker lazydocker
```

then `lazydocker` connects successfully.

> The context name `docker` here might be slightly confusing - it's because that's what I called the LXC container I set up on Proxmox for running a Docker engine.

I can use `docker context inspect` to look into the details of the context, which look like this:

```json
[
    {
        "Name": "docker",
        "Metadata": {
            "Description": "Docker Host on PVE LXC"
        },
        "Endpoints": {
            "docker": {
                "Host": "ssh://dj@docker",
                "SkipTLSVerify": false
            }
        },
        "TLSMaterial": {},
        "Storage": {
            "MetadataPath": "/home/qmacro/.docker/contexts/meta/d548...",
            "TLSPath": "/home/qmacro/.docker/contexts/tls/d548..."
        }
    }
]
```

And using the `--format` option of `docker context inspect` like this:

```shell
docker context inspect --format {% raw %}'{{.Endpoints.docker.Host}}'{% endraw %}
```

I can get the SSH-based host value `ssh://dj@docker` which I can then set in `DOCKER_HOST` and invoke `lazydocker`.

Putting this all together I have now an alias `lado` defined thus:

```shell
alias lado="DOCKER_HOST=$(docker context inspect --format {% raw %}'{{.Endpoints.docker.Host}}'{% endraw %}) lazydocker"
```

which sets the appropriate value, from the current context, in `DOCKER_HOST`, and invokes `lazydocker`.
