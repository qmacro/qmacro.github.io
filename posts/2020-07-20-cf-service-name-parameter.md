---
layout: post
title: In an mta.yaml file you can use the service-name parameter to point to an existing resource
tags:
  - autodidactics
  - cloudfoundry
---

_In `mta.yaml` files you can use the `service-name` parameter to point to an existing service instance with a different name than the resource._

When the contents of a [multi-target application file](https://help.sap.com/viewer/4505d0bdaf4948449b7f7379d24d0f0d/2.0.03/en-US/33548a721e6548688605049792d55295.html) file have been created or modified automatically for you, and there are references to generated service instance names, you don't have to globally replace those names to match whatever service instances you may already have, but instead you can add the `service-name` [parameter](https://help.sap.com/viewer/4505d0bdaf4948449b7f7379d24d0f0d/2.0.03/en-US/4050fee4c469498ebc31b10f2ae15ff2.html) in the resource definition.

For example, when adding a new Workflow module to an existing (`mta.yaml`-based) project, the generator will add something like this:

```
modules:
  - name: OrderProcess
    type: com.sap.application.content
    path: OrderProcess
    requires:
      - name: workflow_mta
        parameters:
          content-target: true
resources:
  - name: workflow_mta
    parameters:
      service-plan: standard
      service: workflow
    type: org.cloudfoundry.managed-service
```

It's often the case that you already have a Workflow service instance, but not with the generated name `workflow_mta`. So after modifying the resource `type` to be `org.cloudfoundry.existing-service`, you can save some time and avoid changing all occurrences of `workflow_mta` to match your actual instance name (e.g. `my-workflow-instance`). Instead, use the `service-name` parameter, like this:

```
modules:
  - name: OrderProcess
    type: com.sap.application.content
    path: OrderProcess
    requires:
      - name: workflow_mta
        parameters:
          content-target: true
resources:
  - name: workflow_mta
    parameters:
      service-name: my-workflow-instance
    type: org.cloudfoundry.existing-service
```

> I learned this a while ago but promptly forgot about it until now, when I needed it again.
