---
title: "Gateway metadata cache check - always abap_true?"
date: 2012-05-08
description: Debugging the Gateway metadata caching mechanism and finding a potential issue.
tags:
  - sap
  - odata
  - abap
  - sap-community-post
---

Hi all

It may be a symptom of being back after a long Bank Holiday weekend, but
I'm debugging the metadata mechanisms of Gateway and came across the
following. In an apparent check to see if caching is enabled or not
(switchable via tx /IWFND/MED_ACTIVATE), the layers end up with a call
to static method IS_CACHING_ENABLED of utility class
/IWBEP/\_CL_MGW_MED_UTILS - I've pasted the call stack below.

Thing is, here's how this method is defined:

**method IS_CACHING_ENABLED.**

**   rv_enabled = abap_true.**

**endmethod.**

Always return "is enabled"?

Has anyone else seen this and wondered about it? If so, please put me
out of my misery. Thanks!

dj

  -------------- -------------------------------------------------- -----------------------------------------
  METHOD         IS_CACHING_ENABLED                                 /IWBEP/CL_MGW_MED_UTILS=======CP
  METHOD         GET_CACHED_MODEL                                   /IWBEP/CL_MGW_MED_UTILS=======CP
  METHOD         GET_MODEL                                          /IWBEP/CL_MGW_MED_PROVIDER====CP
  METHOD         GET_CACHED_MODEL                                   /IWBEP/CL_MGW_MED_PROVIDER====CP
  METHOD         /IWBEP/IF_MGW_MED_PROVIDER\~GET_SERVICE_METADATA   /IWBEP/CL_MGW_MED_PROVIDER====CP
  FUNCTION       /IWBEP/FM_MGW_MED_LOAD                             /IWBEP/SAPLFGR_MGW_CLIENT_IF
  FORM           /IWBEP/FM_MGW_MED_LOAD                             /IWBEP/SAPLFGR_MGW_CLIENT_IF
  FORM           REMOTE_FUNCTION_CALL                               SAPMSSY1
  MODULE (PBO)   %\_RFC_START                                       SAPMSSY1
  PBO MODULE     %\_RFC_START                                                                              
  PBO SCREEN     3004                                               SAPMSSY1
  TRANSACTION    ()                                                                                        
  -------------- -------------------------------------------------- -----------------------------------------

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-q-a/gateway-metadata-cache-check-always-abap-true/qaq-p/8684367)
