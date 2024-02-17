import React, { useEffect, useState } from 'react'
// import exportFromJSON from 'export-from-json'
import * as XLSX from 'xlsx'


export default function ExcelConverter(data, name) {

    const sheet = XLSX.utils?.aoa_to_sheet(data);

    const wb = XLSX.utils?.book_new();

    XLSX?.utils.book_append_sheet(wb, sheet, 'Données');

    const wbout = XLSX.writeFile(wb, name, { bookType: 'xlsx', type: 'base64', compression: true,  });

    const fileDownload = `data:application/vnd.ms-excel;base64,${wbout}`;
    window.open(fileDownload);
    // console.log('#####',fileDownload);
}