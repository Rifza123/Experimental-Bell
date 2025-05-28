import axios from 'axios';
import baileys from "@whiskeysockets/baileys";
import boom from '@hapi/boom';
import chalk from 'chalk';
import cheerio from 'cheerio';
import child from 'child_process';
import chokidar from 'chokidar';
import { createRequire } from 'module';
import form from 'form-data'
import fs from 'fs';
import https from 'https';
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
    fs,
    form,
    https,
    module,
    path,
    pino,
    readline,
    timezone,
    url,
    util
}

String.prototype.r = function() {
  try {
    let url = this.includes("./") ? "../." + this : this;
    let baseUrl = url.split('?')[0];
    let pathFileUrl = `${baseUrl}?t=${Date.now()}`;
    return import(pathFileUrl);
  } catch (e) {
    throw e;
  }
}


String.prototype.import = function() { 
  try {
    if (this in modules) return modules[this];
    return import(this)
  } catch (e) {
    throw e
  }
};

String.prototype.toFormat = function(){ 
    const sizes = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']; 
    const base = 1024;
    const index = Math.floor(Math.log(this) / Math.log(base));
    const convertedSize = (this / Math.pow(base, index)).toFixed(2);
    return `${convertedSize}${sizes[index]}`;
}

String.prototype.developer = function(){ 
   const ary = [
      33, 45, 61, 61, 61, 61, 61, 61, 91, 32, 69, 120, 112, 101, 114, 105, 109, 101, 110, 116, 97, 108, 108, 32, 9676, 32, 66, 101, 108, 108, 129412, 32, 93, 61, 61, 61, 61, 61, 61, 45, 33, 10, 32, 32, 32, 32, 32, 32, 42, 32, 67, 111, 100, 105, 110, 103, 32, 98, 121, 32, 64, 114, 105, 102, 122, 97, 46, 112, 46, 112, 32, 42, 32, 10, 32, 32, 32, 32, 32, 32, 10, 32, 32, 32, 32, 32, 32, 129657, 32, 70, 111, 108, 108, 111, 119, 32, 110, 101, 32, 111, 110, 32, 58, 10, 32, 32, 32, 32, 32, 32, 9676, 32, 104, 116, 116, 112, 115, 58, 47, 47, 121, 111, 117, 116, 117, 98, 101, 46, 99, 111, 109, 47, 64, 114, 105, 102, 122, 97, 32, 32, 10, 32, 32, 32, 32, 32, 32, 9676, 32, 104, 116, 116, 112, 115, 58, 47, 47, 103, 105, 116, 104, 117, 98, 46, 99, 111, 109, 47, 82, 105, 102, 122, 97, 49, 50, 51, 32, 10, 32, 32, 32, 32, 32, 32, 9676, 32, 104, 116, 116, 112, 115, 58, 47, 47, 105, 110, 115, 116, 97, 103, 114, 97, 109, 46, 99, 111, 109, 47, 114, 105, 102, 122, 97, 46, 112, 46, 112, 63, 105, 103, 115, 104, 105, 100, 61, 90, 71, 85, 122, 77, 122, 77, 51, 78, 87, 74, 105, 79, 81, 61, 61, 32, 10, 32, 32, 32, 32, 32, 32, 9676, 32, 104, 116, 116, 112, 115, 58, 47, 47, 119, 119, 119, 46, 116, 104, 114, 101, 97, 100, 115, 46, 110, 101, 116, 47, 64, 114, 105, 102, 122, 97, 46, 112, 46, 112, 32, 10, 32, 32, 32, 32, 32, 32, 9676, 32, 104, 116, 116, 112, 115, 58, 47, 47, 120, 116, 101, 114, 109, 46, 116, 101, 99, 104
   ];
   return String.fromCharCode(...ary)
}

String.prototype.extractBearers = function() { 
  const bearerRegex = /Bearer\s([a-zA-Z0-9\-_\.]+)/g;
  const matches = [...this.matchAll(bearerRegex)];
  return matches.map(match => "Bearer " + match[1]);
};

String.prototype.extractMentions = function() { 
    return [...this.matchAll(/(\+?\d[\d\s-]{8,})/g)]
        .map(match => match[0].replace(/[^0-9]/g, ''))
        .map(number => number.startsWith('08') ? `62${number.substring(2)}` : number)
        .map(number => number.length >= 5 ? `${number}@s.whatsapp.net` : null)
        .filter(Boolean);
};

String.prototype.to = function(type) {
    if (!type) return "Please input type!";
    const supportedTypes = ['base64', 'hex', 'utf8', 'ascii', 'binary', 'ucs2', 'utf16le', 'latin1', 'charCode'];
    if (!supportedTypes.includes(type)) {
        return `Unsupported type: ${type}\nList of supported types:\n${JSON.stringify(supportedTypes, null, 2)}`;
    }
    if (type === 'charCode') {
        return [...this].map(char => char.charCodeAt(0)).join(' ');
    }
    try {
        return Buffer.from(this).toString(type);
    } catch (error) {
        return `Error during conversion: ${error.message}`;
    }
};

String.prototype.un = function(type) {
    if (!type) return "Please input type!";
        const supportedTypes = ['base64', 'hex', 'utf8', 'ascii', 'binary', 'ucs2', 'utf16le', 'latin1', 'charCode'];
    if (!supportedTypes.includes(type)) {
        return `Unsupported type: ${type}\nList of supported types:\n${JSON.stringify(supportedTypes, null, 2)}`;
    }
    if (type === 'charCode') {
        return this.split(' ').map(code => String.fromCharCode(parseInt(code, 10))).join('');
    }
    try {
        return Buffer.from(this, type).toString('utf-8');
    } catch (error) {
        return `Error during conversion: ${error.message}`;
    }
};

String.prototype.decode = function() {
    const isBase64 = str => {
        try {
            return Buffer.from(str, 'base64').toString('base64') === str;
        } catch {
            return false;
        }
    };
    const isHex = str => /^[0-9A-Fa-f]+$/.test(str);
    const isCharCode = str => str.split(' ').every(code => !isNaN(parseInt(code, 10)));
    if (isBase64(this)) {
        return Buffer.from(this, 'base64').toString('utf-8');
    } else if (isHex(this)) {
        return Buffer.from(this, 'hex').toString('utf-8');
    } else if (isCharCode(this)) {
        return this.split(' ').map(code => String.fromCharCode(parseInt(code, 10))).join('');
    } else {
        return `Unable to dencoding for: ${this}`;
    }
};

Array.prototype.getRandom = function() {
    return this[Math.floor(Math.random() * this.length)];
};