#!/usr/bin/env node
/*
Get an EPG listing for OTA TV channels in a specific area code using one of the
following EPG sources:

rovi
mc2xml (interface to Tribune Media Services)
tribune media services

output to CSV or JSON depending on user preference

*/

var util = require('util');
var fs = require('fs');
var rest = require('restler');
var csv = require('csv');
var CSVFILE_DEFAULT = "EPGoutput.csv";
var POSTCODE_DEFAULT = "M5V 1J1"
var ROVI_API_KEY = ''hm35ayppvb5gtxufr2wbntzx'

var financeurl = function(symbols, columns) {
    return util.format(
        'http://finance.yahoo.com/d/quotes.csv?s=%s&f=%s',
        symbols.join('+'),
        columns);
};

var marketCapFloat = function(marketCapString) {
    return parseFloat(marketCapString.split('B')[0]) * 1e9;
};

var csv2console = function(csvfile, headers) {
    console.log(headers.join("\t"));
    csv()
    .from.path(csvfile)
    .on('record', function(row, index) {
        var shares = Math.round(marketCapFloat(row[2])/row[3], 0);
        var eps = (row[3]/row[4]).toFixed(3);
        var earnings = accounting.formatMoney(eps * shares);
        outrow = row.concat([shares, eps, earnings]);
        console.log(outrow.join("\t"));
    });
};

var buildfn = function(csvfile, headers) {
    var response2console = function(result, response) {
        if (result instanceof Error) {
            console.error('Error: ' + util.format(response.message));
        } else {
            console.error("Wrote %s", csvfile);
            fs.writeFileSync(csvfile, result);
            csv2console(csvfile, headers);
        }
    };
    return response2console;
};

var marketResearch = function(symbols, columns, csvfile, headers) {
    symbols = symbols || SYMBOLS_DEFAULT;
    columns = columns || COLUMNS_DEFAULT;
    csvfile = csvfile || CSVFILE_DEFAULT;
    headers = headers || HEADERS_DEFAULT;
    var apiurl = financeurl(symbols, columns);
    var response2console = buildfn(csvfile, headers);
    rest.get(apiurl).on('complete', response2console);
};

if(require.main == module) {
    console.error('Invoked at command line.');
    var symbols = process.argv;
    if(symbols.length > 2) {
        symbols = symbols.slice(2, symbols.length);
    } else {
        symbols = undefined;
    };
    marketResearch(symbols);
} else {
    console.error('Invoked via library call');
}

exports.marketResearch = marketResearch;
