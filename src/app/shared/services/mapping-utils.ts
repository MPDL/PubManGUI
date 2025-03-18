const item_mapping = {
  "mappings": {
    "dynamic": "strict",
    "properties": {
      "context": {
        "properties": {
          "creationDate": {
            "type": "date"
          },
          "creator": {
            "properties": {
              "name": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "normalizer": "sort"
                  },
                  "keyword_default": {
                    "type": "keyword"
                  }
                }
              },
              "objectId": {
                "type": "keyword"
              }
            }
          },
          "lastModificationDate": {
            "type": "date"
          },
          "modifier": {
            "properties": {
              "name": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "normalizer": "sort"
                  },
                  "keyword_default": {
                    "type": "keyword"
                  }
                }
              },
              "objectId": {
                "type": "keyword"
              }
            }
          },
          "name": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "normalizer": "sort"
              },
              "keyword_default": {
                "type": "keyword"
              }
            }
          },
          "objectId": {
            "type": "keyword"
          }
        }
      },
      "creationDate": {
        "type": "date"
      },
      "creator": {
        "properties": {
          "name": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "normalizer": "sort"
              },
              "keyword_default": {
                "type": "keyword"
              }
            }
          },
          "objectId": {
            "type": "keyword"
          }
        }
      },
      "fileData": {
        "properties": {
          "attachment": {
            "properties": {
              "author": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "normalizer": "sort"
                  },
                  "keyword_default": {
                    "type": "keyword"
                  }
                }
              },
              "content": {
                "type": "text",
                "term_vector": "with_positions_offsets"
              },
              "content_length": {
                "type": "long"
              },
              "content_type": {
                "type": "text"
              },
              "date": {
                "type": "date"
              },
              "format": {
                "type": "text"
              },
              "keywords": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "normalizer": "sort"
                  },
                  "keyword_default": {
                    "type": "keyword"
                  }
                }
              },
              "language": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "normalizer": "sort"
                  },
                  "keyword_default": {
                    "type": "keyword"
                  }
                }
              },
              "name": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "normalizer": "sort"
                  },
                  "keyword_default": {
                    "type": "keyword"
                  }
                }
              },
              "title": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "normalizer": "sort"
                  },
                  "keyword_default": {
                    "type": "keyword"
                  }
                }
              }
            }
          },
          "data": {
            "type": "binary"
          },
          "fileId": {
            "type": "keyword"
          },
          "itemId": {
            "type": "keyword"
          }
        }
      },
      "files": {
        "type": "nested",
        "include_in_parent": true,
        "properties": {
          "allowedAudienceIds": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "normalizer": "sort"
              },
              "keyword_default": {
                "type": "keyword"
              }
            }
          },
          "checksum": {
            "type": "text"
          },
          "checksumAlgorithm": {
            "type": "keyword"
          },
          "content": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "normalizer": "sort"
              },
              "keyword_default": {
                "type": "keyword"
              }
            }
          },
          "creationDate": {
            "type": "date"
          },
          "creator": {
            "properties": {
              "name": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "normalizer": "sort"
                  },
                  "keyword_default": {
                    "type": "keyword"
                  }
                }
              },
              "objectId": {
                "type": "keyword"
              }
            }
          },
          "lastModificationDate": {
            "type": "date"
          },
          "metadata": {
            "properties": {
              "contentCategory": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "normalizer": "sort"
                  },
                  "keyword_default": {
                    "type": "keyword"
                  }
                }
              },
              "copyrightDate": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "normalizer": "sort"
                  },
                  "keyword_default": {
                    "type": "keyword"
                  }
                }
              },
              "description": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "normalizer": "sort"
                  },
                  "keyword_default": {
                    "type": "keyword"
                  }
                }
              },
              "embargoUntil": {
                "type": "date",
                "ignore_malformed": true,
                "format": "yyyy-MM-dd||yyyy-MM||yyyy"
              },
              "formats": {
                "properties": {
                  "type": {
                    "type": "text",
                    "fields": {
                      "keyword": {
                        "type": "keyword",
                        "normalizer": "sort"
                      },
                      "keyword_default": {
                        "type": "keyword"
                      }
                    }
                  },
                  "value": {
                    "type": "text",
                    "fields": {
                      "keyword": {
                        "type": "keyword",
                        "normalizer": "sort"
                      },
                      "keyword_default": {
                        "type": "keyword"
                      }
                    }
                  }
                }
              },
              "identifiers": {
                "properties": {
                  "id": {
                    "type": "text",
                    "fields": {
                      "keyword": {
                        "type": "keyword",
                        "normalizer": "sort"
                      },
                      "keyword_default": {
                        "type": "keyword"
                      }
                    }
                  },
                  "type": {
                    "type": "text",
                    "fields": {
                      "keyword": {
                        "type": "keyword",
                        "normalizer": "sort"
                      },
                      "keyword_default": {
                        "type": "keyword"
                      }
                    }
                  }
                }
              },
              "license": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "normalizer": "sort"
                  },
                  "keyword_default": {
                    "type": "keyword"
                  }
                }
              },
              "oaStatus": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "normalizer": "sort"
                  },
                  "keyword_default": {
                    "type": "keyword"
                  }
                }
              },
              "rights": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "normalizer": "sort"
                  },
                  "keyword_default": {
                    "type": "keyword"
                  }
                }
              },
              "size": {
                "type": "long"
              },
              "title": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "normalizer": "sort"
                  },
                  "keyword_default": {
                    "type": "keyword"
                  }
                }
              }
            }
          },
          "mimeType": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "normalizer": "sort"
              },
              "keyword_default": {
                "type": "keyword"
              }
            }
          },
          "name": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "normalizer": "sort"
              },
              "keyword_default": {
                "type": "keyword"
              }
            }
          },
          "objectId": {
            "type": "keyword"
          },
          "pid": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "normalizer": "sort"
              },
              "keyword_default": {
                "type": "keyword"
              }
            }
          },
          "size": {
            "type": "long"
          },
          "storage": {
            "type": "keyword"
          },
          "visibility": {
            "type": "keyword"
          }
        }
      },
      "joinField": {
        "type": "join",
        "eager_global_ordinals": true,
        "relations": {
          "item": "file"
        }
      },
      "lastModificationDate": {
        "type": "date"
      },
      "latestRelease": {
        "properties": {
          "modificationDate": {
            "type": "date"
          },
          "modifiedBy": {
            "properties": {
              "name": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "normalizer": "sort"
                  },
                  "keyword_default": {
                    "type": "keyword"
                  }
                }
              },
              "objectId": {
                "type": "keyword"
              }
            }
          },
          "modifier": {
            "properties": {
              "name": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "normalizer": "sort"
                  },
                  "keyword_default": {
                    "type": "keyword"
                  }
                }
              },
              "objectId": {
                "type": "keyword"
              }
            }
          },
          "objectId": {
            "type": "keyword"
          },
          "versionNumber": {
            "type": "long"
          },
          "versionPid": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "normalizer": "sort"
              },
              "keyword_default": {
                "type": "keyword"
              }
            }
          },
          "versionState": {
            "type": "keyword"
          }
        }
      },
      "latestVersion": {
        "properties": {
          "modificationDate": {
            "type": "date"
          },
          "modifiedBy": {
            "properties": {
              "name": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "normalizer": "sort"
                  },
                  "keyword_default": {
                    "type": "keyword"
                  }
                }
              },
              "objectId": {
                "type": "keyword"
              }
            }
          },
          "modifier": {
            "properties": {
              "name": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "normalizer": "sort"
                  },
                  "keyword_default": {
                    "type": "keyword"
                  }
                }
              },
              "objectId": {
                "type": "keyword"
              }
            }
          },
          "objectId": {
            "type": "keyword"
          },
          "versionNumber": {
            "type": "long"
          },
          "versionPid": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "normalizer": "sort"
              },
              "keyword_default": {
                "type": "keyword"
              }
            }
          },
          "versionState": {
            "type": "keyword"
          }
        }
      },
      "localTags": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "normalizer": "sort"
          },
          "keyword_default": {
            "type": "keyword"
          }
        }
      },
      "message": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "normalizer": "sort"
          },
          "keyword_default": {
            "type": "keyword"
          }
        }
      },
      "metadata": {
        "properties": {
          "abstracts": {
            "type": "nested",
            "include_in_parent": true,
            "properties": {
              "language": {
                "type": "keyword"
              },
              "value": {
                "type": "text",
                "analyzer": "html_standard_analyzer"
              }
            }
          },
          "alternativeTitles": {
            "type": "nested",
            "include_in_parent": true,
            "properties": {
              "language": {
                "type": "keyword"
              },
              "type": {
                "type": "keyword"
              },
              "value": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "normalizer": "sort"
                  },
                  "keyword_default": {
                    "type": "keyword"
                  }
                },
                "analyzer": "html_standard_analyzer"
              }
            }
          },
          "anyDates": {
            "type": "date",
            "format": "yyyy-MM-dd||yyyy-MM||yyyy"
          },
          "creators": {
            "type": "nested",
            "include_in_parent": true,
            "properties": {
              "organization": {
                "properties": {
                  "address": {
                    "type": "text"
                  },
                  "identifier": {
                    "type": "keyword"
                  },
                  "identifierPath": {
                    "type": "keyword"
                  },
                  "name": {
                    "type": "text",
                    "fields": {
                      "keyword": {
                        "type": "keyword",
                        "normalizer": "sort"
                      },
                      "keyword_default": {
                        "type": "keyword"
                      }
                    }
                  }
                }
              },
              "person": {
                "properties": {
                  "completeName": {
                    "type": "text",
                    "fields": {
                      "keyword": {
                        "type": "keyword",
                        "normalizer": "sort"
                      },
                      "keyword_default": {
                        "type": "keyword"
                      }
                    }
                  },
                  "familyName": {
                    "type": "text",
                    "fields": {
                      "keyword": {
                        "type": "keyword",
                        "normalizer": "sort"
                      },
                      "keyword_default": {
                        "type": "keyword"
                      }
                    }
                  },
                  "givenName": {
                    "type": "text",
                    "fields": {
                      "keyword": {
                        "type": "keyword",
                        "normalizer": "sort"
                      },
                      "keyword_default": {
                        "type": "keyword"
                      }
                    }
                  },
                  "alternativeNames": {
                    "type": "text",
                    "fields": {
                      "keyword": {
                        "type": "keyword",
                        "normalizer": "sort"
                      },
                      "keyword_default": {
                        "type": "keyword"
                      }
                    }
                  },
                  "titles": {
                    "type": "text",
                    "fields": {
                      "keyword": {
                        "type": "keyword",
                        "normalizer": "sort"
                      },
                      "keyword_default": {
                        "type": "keyword"
                      }
                    }
                  },
                  "pseudonyms": {
                    "type": "text",
                    "fields": {
                      "keyword": {
                        "type": "keyword",
                        "normalizer": "sort"
                      },
                      "keyword_default": {
                        "type": "keyword"
                      }
                    }
                  },
                  "identifier": {
                    "properties": {
                      "id": {
                        "type": "keyword"
                      },
                      "type": {
                        "type": "keyword"
                      }
                    }
                  },
                  "orcid": {
                    "type": "text",
                    "fields": {
                      "keyword": {
                        "type": "keyword",
                        "normalizer": "sort"
                      },
                      "keyword_default": {
                        "type": "keyword"
                      }
                    }
                  },
                  "organizations": {
                    "type": "nested",
                    "include_in_parent": true,
                    "properties": {
                      "address": {
                        "type": "text"
                      },
                      "identifier": {
                        "type": "keyword"
                      },
                      "identifierPath": {
                        "type": "keyword"
                      },
                      "name": {
                        "type": "text",
                        "fields": {
                          "keyword": {
                            "type": "keyword",
                            "normalizer": "sort"
                          },
                          "keyword_default": {
                            "type": "keyword"
                          }
                        }
                      }
                    }
                  },
                  "organizationsSize": {
                    "type": "long"
                  }
                }
              },
              "role": {
                "type": "keyword"
              },
              "type": {
                "type": "keyword"
              }
            }
          },
          "dateAccepted": {
            "type": "date",
            "copy_to": [
              "metadata.anyDates"
            ],
            "format": "yyyy-MM-dd||yyyy-MM||yyyy"
          },
          "dateCreated": {
            "type": "date",
            "copy_to": [
              "metadata.anyDates"
            ],
            "format": "yyyy-MM-dd||yyyy-MM||yyyy"
          },
          "dateModified": {
            "type": "date",
            "copy_to": [
              "metadata.anyDates"
            ],
            "format": "yyyy-MM-dd||yyyy-MM||yyyy"
          },
          "datePublishedInPrint": {
            "type": "date",
            "copy_to": [
              "metadata.anyDates"
            ],
            "format": "yyyy-MM-dd||yyyy-MM||yyyy"
          },
          "datePublishedOnline": {
            "type": "date",
            "copy_to": [
              "metadata.anyDates"
            ],
            "format": "yyyy-MM-dd||yyyy-MM||yyyy"
          },
          "dateSubmitted": {
            "type": "date",
            "copy_to": [
              "metadata.anyDates"
            ],
            "format": "yyyy-MM-dd||yyyy-MM||yyyy"
          },
          "degree": {
            "type": "keyword"
          },
          "event": {
            "properties": {
              "endDate": {
                "type": "date",
                "ignore_malformed": true,
                "format": "yyyy-MM-dd||yyyy-MM||yyyy"
              },
              "invitationStatus": {
                "type": "keyword"
              },
              "place": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "normalizer": "sort"
                  },
                  "keyword_default": {
                    "type": "keyword"
                  }
                }
              },
              "startDate": {
                "type": "date",
                "ignore_malformed": true,
                "format": "yyyy-MM-dd||yyyy-MM||yyyy"
              },
              "title": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "normalizer": "sort"
                  },
                  "keyword_default": {
                    "type": "keyword"
                  }
                }
              }
            }
          },
          "freeKeywords": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "normalizer": "sort"
              },
              "keyword_default": {
                "type": "keyword"
              }
            }
          },
          "genre": {
            "type": "keyword"
          },
          "identifiers": {
            "type": "nested",
            "include_in_parent": true,
            "properties": {
              "id": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "normalizer": "sort"
                  },
                  "keyword_default": {
                    "type": "keyword"
                  }
                }
              },
              "type": {
                "type": "keyword"
              }
            }
          },
          "languages": {
            "type": "keyword"
          },
          "legalCase": {
            "properties": {
              "courtName": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "normalizer": "sort"
                  },
                  "keyword_default": {
                    "type": "keyword"
                  }
                }
              },
              "datePublished": {
                "type": "date"
              },
              "identifier": {
                "type": "keyword"
              },
              "title": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "normalizer": "sort"
                  },
                  "keyword_default": {
                    "type": "keyword"
                  }
                }
              }
            }
          },
          "location": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "normalizer": "sort"
              },
              "keyword_default": {
                "type": "keyword"
              }
            }
          },
          "projectInfo": {
            "properties": {
              "fundingInfo": {
                "properties": {
                  "fundingOrganization": {
                    "properties": {
                      "identifiers": {
                        "properties": {
                          "id": {
                            "type": "keyword"
                          },
                          "type": {
                            "type": "keyword"
                          }
                        }
                      },
                      "title": {
                        "type": "text",
                        "fields": {
                          "keyword": {
                            "type": "keyword",
                            "normalizer": "sort"
                          },
                          "keyword_default": {
                            "type": "keyword"
                          }
                        }
                      }
                    }
                  },
                  "fundingProgram": {
                    "properties": {
                      "identifiers": {
                        "properties": {
                          "id": {
                            "type": "keyword"
                          },
                          "type": {
                            "type": "keyword"
                          }
                        }
                      },
                      "title": {
                        "type": "text",
                        "fields": {
                          "keyword": {
                            "type": "keyword",
                            "normalizer": "sort"
                          },
                          "keyword_default": {
                            "type": "keyword"
                          }
                        }
                      }
                    }
                  }
                }
              },
              "grantIdentifier": {
                "properties": {
                  "id": {
                    "type": "keyword"
                  },
                  "type": {
                    "type": "keyword"
                  }
                }
              },
              "title": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "normalizer": "sort"
                  },
                  "keyword_default": {
                    "type": "keyword"
                  }
                }
              }
            }
          },
          "publishingInfo": {
            "properties": {
              "edition": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "normalizer": "sort"
                  },
                  "keyword_default": {
                    "type": "keyword"
                  }
                }
              },
              "place": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "normalizer": "sort"
                  },
                  "keyword_default": {
                    "type": "keyword"
                  }
                }
              },
              "publisher": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "normalizer": "sort"
                  },
                  "keyword_default": {
                    "type": "keyword"
                  }
                }
              }
            }
          },
          "reviewMethod": {
            "type": "keyword"
          },
          "sources": {
            "type": "nested",
            "include_in_parent": true,
            "properties": {
              "alternativeTitles": {
                "type": "nested",
                "include_in_parent": true,
                "properties": {
                  "language": {
                    "type": "keyword"
                  },
                  "type": {
                    "type": "keyword"
                  },
                  "value": {
                    "type": "text",
                    "fields": {
                      "keyword": {
                        "type": "keyword",
                        "normalizer": "sort"
                      },
                      "keyword_default": {
                        "type": "keyword"
                      }
                    }
                  }
                }
              },
              "creators": {
                "type": "nested",
                "include_in_parent": true,
                "properties": {
                  "organization": {
                    "properties": {
                      "address": {
                        "type": "text",
                        "fields": {
                          "keyword": {
                            "type": "keyword",
                            "normalizer": "sort"
                          },
                          "keyword_default": {
                            "type": "keyword"
                          }
                        }
                      },
                      "identifier": {
                        "type": "keyword"
                      },
                      "identifierPath": {
                        "type": "keyword"
                      },
                      "name": {
                        "type": "text",
                        "fields": {
                          "keyword": {
                            "type": "keyword",
                            "normalizer": "sort"
                          },
                          "keyword_default": {
                            "type": "keyword"
                          }
                        }
                      }
                    }
                  },
                  "person": {
                    "properties": {
                      "completeName": {
                        "type": "text",
                        "fields": {
                          "keyword": {
                            "type": "keyword",
                            "normalizer": "sort"
                          },
                          "keyword_default": {
                            "type": "keyword"
                          }
                        }
                      },
                      "familyName": {
                        "type": "text",
                        "fields": {
                          "keyword": {
                            "type": "keyword",
                            "normalizer": "sort"
                          },
                          "keyword_default": {
                            "type": "keyword"
                          }
                        }
                      },
                      "givenName": {
                        "type": "text",
                        "fields": {
                          "keyword": {
                            "type": "keyword",
                            "normalizer": "sort"
                          },
                          "keyword_default": {
                            "type": "keyword"
                          }
                        }
                      },
                      "alternativeNames": {
                        "type": "text",
                        "fields": {
                          "keyword": {
                            "type": "keyword",
                            "normalizer": "sort"
                          },
                          "keyword_default": {
                            "type": "keyword"
                          }
                        }
                      },
                      "titles": {
                        "type": "text",
                        "fields": {
                          "keyword": {
                            "type": "keyword",
                            "normalizer": "sort"
                          },
                          "keyword_default": {
                            "type": "keyword"
                          }
                        }
                      },
                      "pseudonyms": {
                        "type": "text",
                        "fields": {
                          "keyword": {
                            "type": "keyword",
                            "normalizer": "sort"
                          },
                          "keyword_default": {
                            "type": "keyword"
                          }
                        }
                      },
                      "identifier": {
                        "properties": {
                          "id": {
                            "type": "keyword"
                          },
                          "type": {
                            "type": "keyword"
                          }
                        }
                      },
                      "orcid": {
                        "type": "text",
                        "fields": {
                          "keyword": {
                            "type": "keyword",
                            "normalizer": "sort"
                          },
                          "keyword_default": {
                            "type": "keyword"
                          }
                        }
                      },
                      "organizations": {
                        "type": "nested",
                        "include_in_parent": true,
                        "properties": {
                          "address": {
                            "type": "text",
                            "fields": {
                              "keyword": {
                                "type": "keyword",
                                "normalizer": "sort"
                              },
                              "keyword_default": {
                                "type": "keyword"
                              }
                            }
                          },
                          "identifier": {
                            "type": "keyword"
                          },
                          "identifierPath": {
                            "type": "keyword"
                          },
                          "name": {
                            "type": "text",
                            "fields": {
                              "keyword": {
                                "type": "keyword",
                                "normalizer": "sort"
                              },
                              "keyword_default": {
                                "type": "keyword"
                              }
                            }
                          }
                        }
                      },
                      "organizationsSize": {
                        "type": "long"
                      }
                    }
                  },
                  "role": {
                    "type": "keyword"
                  },
                  "type": {
                    "type": "keyword"
                  }
                }
              },
              "datePublishedInPrint": {
                "type": "date"
              },
              "endPage": {
                "type": "text"
              },
              "genre": {
                "type": "keyword"
              },
              "identifiers": {
                "type": "nested",
                "include_in_parent": true,
                "properties": {
                  "id": {
                    "type": "text",
                    "fields": {
                      "keyword": {
                        "type": "keyword",
                        "normalizer": "sort"
                      },
                      "keyword_default": {
                        "type": "keyword"
                      }
                    }
                  },
                  "type": {
                    "type": "keyword"
                  }
                }
              },
              "issue": {
                "type": "text"
              },
              "publishingInfo": {
                "properties": {
                  "edition": {
                    "type": "text",
                    "fields": {
                      "keyword": {
                        "type": "keyword",
                        "normalizer": "sort"
                      },
                      "keyword_default": {
                        "type": "keyword"
                      }
                    }
                  },
                  "place": {
                    "type": "text",
                    "fields": {
                      "keyword": {
                        "type": "keyword",
                        "normalizer": "sort"
                      },
                      "keyword_default": {
                        "type": "keyword"
                      }
                    }
                  },
                  "publisher": {
                    "type": "text",
                    "fields": {
                      "keyword": {
                        "type": "keyword",
                        "normalizer": "sort"
                      },
                      "keyword_default": {
                        "type": "keyword"
                      }
                    }
                  }
                }
              },
              "sequenceNumber": {
                "type": "text"
              },
              "startPage": {
                "type": "text"
              },
              "title": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "normalizer": "sort"
                  },
                  "keyword_default": {
                    "type": "keyword"
                  }
                }
              },
              "totalNumberOfPages": {
                "type": "text"
              },
              "volume": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "normalizer": "sort"
                  },
                  "keyword_default": {
                    "type": "keyword"
                  }
                }
              }
            }
          },
          "subjects": {
            "type": "nested",
            "include_in_parent": true,
            "properties": {
              "type": {
                "type": "keyword"
              },
              "value": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "normalizer": "sort"
                  },
                  "keyword_default": {
                    "type": "keyword"
                  }
                }
              },
              "language": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "normalizer": "sort"
                  },
                  "keyword_default": {
                    "type": "keyword"
                  }
                }
              }
            }
          },
          "tableOfContents": {
            "type": "text"
          },
          "title": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "normalizer": "sort"
              },
              "keyword_default": {
                "type": "keyword"
              }
            },
            "analyzer": "html_standard_analyzer"
          },
          "totalNumberOfPages": {
            "type": "text"
          }
        }
      },
      "modificationDate": {
        "type": "date"
      },
      "modifiedBy": {
        "properties": {
          "name": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "normalizer": "sort"
              },
              "keyword_default": {
                "type": "keyword"
              }
            }
          },
          "objectId": {
            "type": "keyword"
          }
        }
      },
      "modifier": {
        "properties": {
          "name": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "normalizer": "sort"
              },
              "keyword_default": {
                "type": "keyword"
              }
            }
          },
          "objectId": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "normalizer": "sort"
              },
              "keyword_default": {
                "type": "keyword"
              }
            }
          }
        }
      },
      "objectId": {
        "type": "keyword"
      },
      "objectPid": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "normalizer": "sort"
          },
          "keyword_default": {
            "type": "keyword"
          }
        }
      },
      "publicState": {
        "type": "keyword"
      },
      "sort-metadata-creators-compound": {
        "type": "keyword",
        "normalizer": "sort"
      },
      "sort-metadata-creators-first": {
        "type": "keyword",
        "normalizer": "sort"
      },
      "sort-metadata-dates-by-category": {
        "type": "date",
        "format": "yyyy-MM-dd||yyyy-MM||yyyy"
      },
      "sort-metadata-dates-by-category-year": {
        "type": "date",
        "format": "yyyy"
      },
      "versionNumber": {
        "type": "long"
      },
      "versionPid": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "normalizer": "sort"
          },
          "keyword_default": {
            "type": "keyword"
          }
        }
      },
      "versionState": {
        "type": "keyword"
      }
    }
  }

}

export interface ElasticSearchIndexFields {
  [key: string] : ElasticSearchIndexField,
}
export interface ElasticSearchIndexField {
  indexName? : string,
  nestedPaths? : string[]
  type? : string,

}

export const createIndexMapFromElasticsearch = () => {
  let  result: ElasticSearchIndexFields = {};
  fillMap(item_mapping["mappings"]["properties"], result, "", []);
  return result;
}

const fillMap = (currentObject : Object, resultObject: ElasticSearchIndexFields, currentPath: string, currentNestedPaths: string[]):  void => {

  //console.log("Processing" + JSON.stringify(currentObject));

  for (let [key, value] of Object.entries(currentObject)) {


    let  newCurrentPath = currentPath;
    let  newCurrentNestedPaths = [...currentNestedPaths];

    if (newCurrentPath.length > 0) {
      newCurrentPath = newCurrentPath.concat(".");
    }
    newCurrentPath = newCurrentPath.concat(key);

    if (value["type"]==="nested") {
      //console.log("found nested " + newCurrentPath)
      newCurrentNestedPaths.push(newCurrentPath);
    }


    if (!value["properties"] && value["type"] !== "nested") {
      let  indexField: ElasticSearchIndexField =
        createIndexFieldObject(newCurrentPath, newCurrentNestedPaths, value["type"]);
      resultObject[newCurrentPath] = indexField;
      //indexMap.put(newCurrentPath.toString(), indexField);
      //System.out.println(newCurrentPath.toString() + " -- " + newCurrentNestedPaths + " -- " + entry.getValue()._kind().jsonValue());
    }

    if (value["properties"]) {
      //console.log("Properties found: " + JSON.stringify(value["properties"]))
      fillMap(value["properties"], resultObject, newCurrentPath, newCurrentNestedPaths);
    } else if (value["type"] === "nested") {
      //console.log("Nested found: " + JSON.stringify(value["properties"]))
      fillMap(value["properties"], resultObject, newCurrentPath, newCurrentNestedPaths);
    } else if (value["fields"]){
      //console.log("Fields found: " + JSON.stringify(value["fields"]))
      fillMap( value["fields"], resultObject, newCurrentPath, newCurrentNestedPaths);
    }


  }



}



const createIndexFieldObject = (path: string, nestedPath: string[] | null, type: string):  ElasticSearchIndexField => {

  //console.log("Create field: " + path + " -- " + nestedPath + " -- " + type);

  let  indexField: ElasticSearchIndexField = {};

  indexField.indexName = path;

  if (nestedPath != null && nestedPath.length) {
    indexField.nestedPaths= nestedPath;
  }
  switch (type) {
    case "text": {
      indexField.type="text";
      break;
    }
    case "keyword": {
      indexField.type="keyword";
      //indexField.setType(ElasticSearchIndexField.Type.KEYWORD);
      break;
    }
    case "boolean": {
      indexField.type="boolean";
      //indexField.setType(ElasticSearchIndexField.Type.BOOLEAN);
      break;
    }
    case "date": {
      indexField.type="date";
      //indexField.setType(ElasticSearchIndexField.Type.DATE);
      break;
    }

    case "long":
    case "integer":
    case "short":
    case "byte":
    case "double":
    case "float":
    case "half_float":
    case "scale_float": {
      indexField.type="numeric";
      //indexField.setType(ElasticSearchIndexField.Type.NUMERIC);
      break;
    }
    default: {
      indexField.type="unknown";
      //indexField.setType(ElasticSearchIndexField.Type.UNKNOWN);
    }

  }
  return indexField;
}

export const elasticSearchFields = createIndexMapFromElasticsearch();


