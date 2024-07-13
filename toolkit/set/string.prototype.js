import axios from 'axios';
import baileys from "@whiskeysockets/baileys";
import boom from '@hapi/boom';
import chalk from 'chalk';
import cheerio from 'cheerio';
import child from 'child_process';
import chokidar from 'chokidar';
import { createRequire } from 'module';
import fetch from 'node-fetch';
import form from 'form-data'
import fs from 'fs';
import https from 'https';
import nodecache from "node-cache";
import path from 'path';
import pino from "pino";
import readline from "readline";
import timezone from "moment-timezone";
import url from 'url';
import module from 'module';
import util from "util";

let modules = {
    axios,
    baileys,
    boom,
    chalk,
    cheerio,
    child,
    chokidar,
    fetch,
    fs,
    form,
    https,
    module,
    nodecache,    
    path,
    pino,
    readline,
    timezone,
    url,
    util
}

String.prototype.r = function(){ 
   let m = this.includes("./") ? "../." + this + "?t=" + Date.now() : this
   return import(m)
}
String.prototype.import =  function(){ 
   if(this in modules) return modules[this]
    return import(this)
}
String.prototype.toFormat = function(){ 
    const sizes = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']; 
    const base = 1024;
    const index = Math.floor(Math.log(this) / Math.log(base));
    const convertedSize = (this / Math.pow(base, index)).toFixed(2);
    return `${convertedSize}${sizes[index]}`;
}
