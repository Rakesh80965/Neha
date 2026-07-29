import React from 'react';

export const TestReport1026Component = () => {
  return (
    <div 
      className="html2pdf__page-break" 
      style={{ 
        pageBreakBefore: 'always', 
        breakBefore: 'page', 
        marginTop: '25px', 
        paddingTop: '15px', 
        fontFamily: 'Arial, Helvetica, sans-serif', 
        color: '#111',
        background: '#ffffff'
      }}
    >
      <div style={{ border: '1.5px solid #000', padding: '15px', background: '#ffffff' }}>
        {/* LOGO & TITLE HEADER */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
          <tbody>
            <tr>
              <td style={{ width: '18%', textAlign: 'center', verticalAlign: 'middle', border: '1px solid #000', padding: '6px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '50%', background: '#dc2626', color: '#ffffff', fontWeight: 'bold', fontSize: '12px' }}>
                  NSL
                </div>
                <div style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '2px' }}>TEXTILES</div>
                <div style={{ fontSize: '7px', color: '#555' }}>Cotton to Clothing</div>
              </td>
              <td style={{ width: '82%', textAlign: 'center', border: '1px solid #000', padding: '6px', background: '#ffffff' }}>
                <h2 style={{ margin: '2px 0', fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px' }}>NSL TEXTILES LTD</h2>
                <p style={{ margin: '2px 0', fontSize: '10px', fontWeight: 'bold', color: '#111' }}>KUNCHALAVRIPALEM CHANDOLE (PO) GUNTUR (DIST) ANDHRA PRADESH</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', borderTop: '1px solid #000', paddingTop: '4px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '12px', marginLeft: '10px' }}>WOVEN FABRIC TEST REPORT</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ background: '#e2e8f0', padding: '2px 8px', fontWeight: 'bold', fontSize: '10px' }}>REPORT</span>
                    <span style={{ background: '#22c55e', color: '#fff', padding: '2px 14px', fontWeight: 'bold', borderRadius: '3px', fontSize: '11px', marginRight: '10px' }}>PASS</span>
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* METADATA GRID */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', fontSize: '10.5px' }}>
          <tbody>
            <tr>
              <td style={{ fontWeight: 'bold', background: '#ffffff', width: '18%', border: '1px solid #000', padding: '4px 6px' }}>TEST REPORT NO</td>
              <td style={{ width: '32%', fontWeight: 'bold', border: '1px solid #000', padding: '4px 6px' }}>12216</td>
              <td style={{ fontWeight: 'bold', background: '#ffffff', width: '18%', border: '1px solid #000', padding: '4px 6px' }}>LOG IN DATE</td>
              <td style={{ width: '32%', border: '1px solid #000', padding: '4px 6px' }}>26.06.2026</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', background: '#ffffff', border: '1px solid #000', padding: '4px 6px' }}>SALES/ORDER NO</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px' }}>30129808/2</td>
              <td style={{ fontWeight: 'bold', background: '#ffffff', border: '1px solid #000', padding: '4px 6px' }}>LOG OUT DATE</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px' }}>-</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', background: '#ffffff', border: '1px solid #000', padding: '4px 6px' }}>CUSTOMER NAME</td>
              <td style={{ fontWeight: 'bold', border: '1px solid #000', padding: '4px 6px' }}>BENETTON INDIA PRIVATE LIMITED</td>
              <td style={{ fontWeight: 'bold', background: '#ffffff', border: '1px solid #000', padding: '4px 6px' }}>COLOUR NAME</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px' }}>26A5CH305OXFI-904 BLUE</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', background: '#ffffff', border: '1px solid #000', padding: '4px 6px' }}>NSL REF #</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px' }}>VF812PA508710033</td>
              <td style={{ fontWeight: 'bold', background: '#ffffff', border: '1px solid #000', padding: '4px 6px' }}>PO NO #</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px' }}>141233469</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', background: '#ffffff', border: '1px solid #000', padding: '4px 6px' }}>SAMPLE DESCRIPTION</td>
              <td style={{ fontWeight: 'bold', border: '1px solid #000', padding: '4px 6px' }}>WOVEN FABRIC</td>
              <td style={{ fontWeight: 'bold', background: '#ffffff', border: '1px solid #000', padding: '4px 6px' }}>WASH/FINISH</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px' }}>COTTON SOFT FINISH</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', background: '#ffffff', border: '1px solid #000', padding: '4px 6px' }}>STAGE OF SAMPLE</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px' }}>FINISHING</td>
              <td style={{ fontWeight: 'bold', background: '#ffffff', border: '1px solid #000', padding: '4px 6px' }}>END PRODUCT</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px' }}>-</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', background: '#ffffff', border: '1px solid #000', padding: '4px 6px' }}>COLOUR CODE/NAME</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px' }}>26A5CH305OXFI-904 BLUE</td>
              <td style={{ fontWeight: 'bold', background: '#ffffff', border: '1px solid #000', padding: '4px 6px' }}>PROTOCOL FOLLOWED</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px' }}>BENETTON</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', background: '#ffffff', border: '1px solid #000', padding: '4px 6px' }}>QUALITY:</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold' }}>20SLx21LYOC-LEA/64x54/58"/PLAIN/CSF</td>
              <td style={{ fontWeight: 'bold', background: '#ffffff', border: '1px solid #000', padding: '4px 6px' }}>FINISH WIDTH</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px' }}>CMS 148.5 &nbsp;&nbsp;&nbsp;&nbsp; INCH 58.5</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', background: '#ffffff', border: '1px solid #000', padding: '4px 6px' }}>FIBER CONTENT</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold' }}>50% COTTON, 40% LYOCEL, 10% INEN</td>
              <td style={{ fontWeight: 'bold', background: '#ffffff', border: '1px solid #000', padding: '4px 6px' }}>CUTTABLE WIDTH</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px' }}>CMS 146.0 &nbsp;&nbsp;&nbsp;&nbsp; INCH 57.5</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', background: '#ffffff', border: '1px solid #000', padding: '4px 6px' }}>WASH CARE</td>
              <td colSpan="3" style={{ fontWeight: 'bold', border: '1px solid #000', padding: '4px 6px' }}>MACHINE WASH 40 DEGREE, TUMBLE DRY</td>
            </tr>
          </tbody>
        </table>

        {/* PHYSICAL TEST RESULTS */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', fontSize: '10px' }}>
          <thead>
            <tr style={{ background: '#ffffff' }}>
              <th style={{ border: '1px solid #000', padding: '4px', width: '20%', textAlign: 'left' }}>TEST NAME</th>
              <th style={{ border: '1px solid #000', padding: '4px', width: '15%', textAlign: 'center' }}>TEST METHOD</th>
              <th style={{ border: '1px solid #000', padding: '4px', width: '15%', textAlign: 'center' }}>PARAMETER</th>
              <th style={{ border: '1px solid #000', padding: '4px', width: '15%', textAlign: 'center' }}>TEST RESULTS</th>
              <th style={{ border: '1px solid #000', padding: '4px', width: '15%', textAlign: 'center' }}>REQUIREMENTS</th>
              <th style={{ border: '1px solid #000', padding: '4px', width: '10%', textAlign: 'center' }}>CONCLUSION</th>
              <th style={{ border: '1px solid #000', padding: '4px', width: '10%', textAlign: 'center' }}>REMARKS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowSpan="2" style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold' }}>THREAD COUNT</td>
              <td rowSpan="2" style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>ISO 7211-2</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>EPI</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center', fontWeight: 'bold' }}>63</td>
              <td rowSpan="2" style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>+/-5%</td>
              <td rowSpan="2" style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center', fontWeight: 'bold' }}>SEE RESULTS</td>
              <td rowSpan="2" style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}></td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>PPI</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center', fontWeight: 'bold' }}>54</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold' }}>FABRIC WEIGHT</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>ISO 3801</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>GSM</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center', fontWeight: 'bold' }}>144</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>+/-5%</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center', fontWeight: 'bold' }}>SEE RESULTS</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}></td>
            </tr>
            <tr>
              <td rowSpan="2" style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold' }}>DIMENSIONAL STABILITY TO WASHING</td>
              <td rowSpan="2" style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>ISO 6330</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>WARP</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center', fontWeight: 'bold' }}>-2.0</td>
              <td rowSpan="2" style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>+1 TO -3%</td>
              <td rowSpan="2" style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center', fontWeight: 'bold' }}>PASS</td>
              <td rowSpan="2" style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center', fontSize: '9px' }}>FDS: +1% / -5%</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>WEFT</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center', fontWeight: 'bold' }}>-3.0</td>
            </tr>
            <tr>
              <td rowSpan="2" style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold' }}>TEAR STRENGTH</td>
              <td rowSpan="2" style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>ISO 13937-1</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>WARP</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center', fontWeight: 'bold' }}>2.13 KGF</td>
              <td rowSpan="2" style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>1.0 KGF</td>
              <td rowSpan="2" style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center', fontWeight: 'bold' }}>PASS</td>
              <td rowSpan="2" style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}></td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>WEFT</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center', fontWeight: 'bold' }}>3.86 KGF</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold' }}>BOWING</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>ASTM D 3882</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>-</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center', fontWeight: 'bold' }}>1.2</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>-</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center', fontWeight: 'bold' }}>SEE RESULTS</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}></td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold' }}>SKEW</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>ASTM D 3882</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>-</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center', fontWeight: 'bold' }}>2.1</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>-</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center', fontWeight: 'bold' }}>SEE RESULTS</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}></td>
            </tr>
          </tbody>
        </table>

        {/* COLOUR FASTNESS TABLE */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
          <thead>
            <tr style={{ background: '#ffffff', textAlign: 'center', fontWeight: 'bold' }}>
              <td colSpan="6" style={{ border: '1px solid #000', padding: '4px', fontSize: '11px', textTransform: 'uppercase' }}>COLOUR FASTNESS</td>
            </tr>
            <tr style={{ background: '#ffffff' }}>
              <th style={{ border: '1px solid #000', padding: '4px', width: '20%' }}>TEST METHOD</th>
              <th style={{ border: '1px solid #000', padding: '4px', width: '20%', textAlign: 'center' }}>CF TO WASHING<br/><span style={{ fontSize: '9px', fontWeight: 'normal' }}>ISO 105 C06</span></th>
              <th colSpan="2" style={{ border: '1px solid #000', padding: '4px', width: '25%', textAlign: 'center' }}>CF TO PERSPIRATION<br/><span style={{ fontSize: '9px', fontWeight: 'normal' }}>ISO 105 E04</span><br/><span style={{ fontSize: '8px' }}>ACID &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ALKALI</span></th>
              <th style={{ border: '1px solid #000', padding: '4px', width: '18%', textAlign: 'center' }}>CF TO WATER<br/><span style={{ fontSize: '9px', fontWeight: 'normal' }}>ISO 105 E01</span></th>
              <th style={{ border: '1px solid #000', padding: '4px', width: '17%', textAlign: 'center' }}>REQUIREMENT / REMARKS</th>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '3px', fontWeight: 'bold' }}>REQUIREMENTS</td>
              <td style={{ border: '1px solid #000', padding: '3px', textAlign: 'center', fontSize: '9px' }}>CC:4/CS:4/SS:4-5</td>
              <td colSpan="2" style={{ border: '1px solid #000', padding: '3px', textAlign: 'center', fontSize: '9px' }}>CC:4/CS:4/SS:4-5</td>
              <td style={{ border: '1px solid #000', padding: '3px', textAlign: 'center', fontSize: '9px' }}>-</td>
              <td rowSpan="10" style={{ border: '1px solid #000', padding: '3px', textAlign: 'center', fontWeight: 'bold', fontSize: '13px' }}>PASS</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #000', padding: '3px 5px', fontWeight: 'bold' }}>COLOUR CHANGE</td>
              <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>4.0</td>
              <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>4.0</td>
              <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>4.0</td>
              <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>4.0</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '3px 5px', fontWeight: 'bold' }}>SELF STAINING</td>
              <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>4-5</td>
              <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>4-5</td>
              <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>4-5</td>
              <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>4-5</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '3px 5px', fontWeight: 'bold' }}>ACETATE</td>
              <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>4.0</td>
              <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>4.0</td>
              <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>4.0</td>
              <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>4.0</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '3px 5px', fontWeight: 'bold' }}>COTTON</td>
              <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>4.0</td>
              <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>4.0</td>
              <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>4.0</td>
              <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>4.0</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '3px 5px', fontWeight: 'bold' }}>NYLON</td>
              <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>4.0</td>
              <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>4.0</td>
              <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>4.0</td>
              <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>4.0</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '3px 5px', fontWeight: 'bold' }}>POLYESTER</td>
              <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>4.0</td>
              <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>4.0</td>
              <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>4.0</td>
              <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>4.0</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '3px 5px', fontWeight: 'bold' }}>ACRYLIC</td>
              <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>4.0</td>
              <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>4.0</td>
              <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>4.0</td>
              <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>4.0</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '3px 5px', fontWeight: 'bold' }}>WOOL</td>
              <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>4.0</td>
              <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>4.0</td>
              <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>4.0</td>
              <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>4.0</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '3px 5px', fontWeight: 'bold' }}>COLOUR FASTNESS TO RUBBING (ISO 105 X12)</td>
              <td colSpan="2" style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>DRY: 4.5 &nbsp;&nbsp;&nbsp;&nbsp; WET: 4.0</td>
              <td colSpan="2" style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>REQ: 4 / 3-4</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '3px 5px', fontWeight: 'bold' }}>PH VALUE (ISO 3071)</td>
              <td colSpan="3" style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center', fontWeight: 'bold' }}>6.6</td>
              <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>REQ: 4.0 - 7.5</td>
            </tr>
          </tbody>
        </table>

        {/* FOOTER SIGNATURES */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', paddingTop: '15px', borderTop: '1px solid #000' }}>
          <div style={{ textAlign: 'center', width: '200px' }}>
            <div style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '11px' }}>PREPARED BY</div>
          </div>
          <div style={{ textAlign: 'center', width: '200px' }}>
            <div style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '11px' }}>APPROVED BY</div>
            <div style={{ marginTop: '5px', fontSize: '11px', fontWeight: 'bold' }}>LAB INCHARGE</div>
          </div>
        </div>
      </div>
    </div>
  );
};
