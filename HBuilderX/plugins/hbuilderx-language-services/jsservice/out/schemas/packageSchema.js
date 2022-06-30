"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageSchema = void 0;
let PackageSchema = {
    "title": "Node package.json",
    "description": "Node package.json",
    "type": "object",
    "properties": {
        "name": {
            "type": "string"
        },
        "author": {
            "type": ["string", "object"],
            "properties": {
                "name": {
                    "type": "string"
                },
                "email": {
                    "type": "string"
                },
                "url": {
                    "type": "string"
                }
            }
        },
        "contributors": {
            "type": ["string", "object"],
            "properties": {
                "name": {
                    "type": "string"
                },
                "email": {
                    "type": "string"
                },
                "url": {
                    "type": "string"
                }
            }
        },
        "bugs": {
            "type": "string"
        },
        "homepage": {
            "type": "string"
        },
        "version": {
            "type": "string"
        },
        "license": {
            "enum": ["MIT", "BSD", "GPL", "LGPL", "Apache", "Mozilla"]
        },
        "keywords": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "description": {
            "type": "string"
        },
        "repository": {
            "type": ["string", "object"],
            "properties": {
                "type": {
                    "enum": ["git", "svn"]
                },
                "url": {
                    "type": "string"
                }
            }
        },
        "main": {
            "type": "string"
        },
        "private": {
            "type": "boolean"
        },
        "scripts": {
            "type": "object",
            "properties": {
                "dev": {
                    "type": "string"
                },
                "start": {
                    "type": "string"
                },
                "unit": {
                    "type": "string"
                },
                "test": {
                    "type": "string"
                },
                "lint": {
                    "type": "string"
                },
                "build": {
                    "type": "string"
                },
                "serve": {
                    "type": "string"
                }
            }
        },
        "dependencies": {
            "type": "object"
        },
        "devDependencies": {
            "type": "object"
        },
        "engines": {
            "type": "object",
            "properties": {
                "node": {
                    "type": "string"
                },
                "npm": {
                    "type": "string"
                },
                "yarn": {
                    "type": "string"
                },
                "HBuilderX": {
                    "type": "string"
                }
            }
        },
        "browserslist": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        // HBuilder X properties
        "id": {
            "type": "string"
        },
        "displayName": {
            "type": "string"
        },
        "publisher": {
            "type": "string"
        },
        "categories": {
            "type": "array",
            "items": {
                "enum": ["Other"]
            }
        },
        "activationEvents": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "contributes": {
            "type": "object",
            "properties": {
                "commands": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "command": {
                                "type": "string"
                            },
                            "title": {
                                "type": "string"
                            }
                        }
                    }
                },
                "menus": {
                    "type": "object"
                }
            }
        },
        "extensionDependencies": {
            "type": "array"
        },
        "config": {
            "type": "string"
        },
        "publishConfig": {
            "type": "array"
        },
        "peerDependencies": {
            "type": "object"
        },
        "bundledDependencies": {
            "type": "object"
        },
        "optionalDependencies": {
            "type": "object"
        },
        "style": {
            "type": ["string", "object"]
        },
        "funding": {
            "type": "object"
        },
        "files": {
            "type": "array"
        },
        "bin": {
            "type": ["string", "object"]
        },
        "man": {
            "type": ["string", "array"]
        },
        "os": {
            "type": "array",
            "items": {
                "enum": ["darwin", "linux", "win32"]
            }
        },
        "cpu": {
            "type": "array",
            "items": {
                "enum": ["x64", "ia32", "arm"]
            }
        },
        "module": {
            "type": "string"
        },
        "workspaces": {
            "type": "array"
        },
        "preferGlobal": {
            "type": "boolean"
        },
        "unpkg": {
            "type": ["string", "array"]
        },
        "typesVersions": {
            "type": "object"
        },
        "typings": {
            "type": "string"
        },
        "sideEffects": {
            "type": "boolean"
        },
        "babel": {
            "type": "object"
        },
        "eslintConfig": {
            "type": "object"
        },
        "jest": {
            "type": "object"
        },
        "__category": {
            "type": "string"
        },
        "__private": {
            "type": "boolean"
        },
        "configurationFiles": {
            "type": "array"
        },
        "configurationFileInfos": {
            "type": "object"
        },
        "_moduleAliases": {
            "type": "object"
        }
    }
};
exports.PackageSchema = PackageSchema;
//# sourceMappingURL=packageSchema.js.map