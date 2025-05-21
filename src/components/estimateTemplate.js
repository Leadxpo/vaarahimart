import React, { useState } from 'react';
import { Button, View, TouchableOpacity, Text, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import RNFS from 'react-native-fs';
import fontkit from '@pdf-lib/fontkit'; // Import fontkit
import { BlendMode, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Buffer } from 'buffer'; // Import Buffer from 'buffer'
import FileViewer from "react-native-file-viewer";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const EstimateTemplate = ({ data }) => {
  const [loading, setLoading] = useState(false);
  function convertNumberToWords(amount) {
    const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const teens = ["", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const thousands = ["", "Thousand", "Million", "Billion"];

    if (amount === 0) return "Zero";

    let word = "";
    let place = 0;

    while (amount > 0) {
      const chunk = amount % 1000;

      if (chunk > 0) {
        const chunkWord = convertChunk(chunk);
        word = `${chunkWord} ${thousands[place]} ${word}`.trim();
      }

      amount = Math.floor(amount / 1000);
      place++;
    }

    return word;

    function convertChunk(chunk) {
      let chunkWord = "";

      if (chunk >= 100) {
        const hundreds = Math.floor(chunk / 100);
        chunkWord += `${units[hundreds]} Hundred `;
        chunk %= 100;
      }

      if (chunk >= 11 && chunk <= 19) {
        chunkWord += `${teens[chunk - 10]} `;
      } else {
        const tensPlace = Math.floor(chunk / 10);
        const unitsPlace = chunk % 10;
        chunkWord += `${tens[tensPlace]} ${units[unitsPlace]} `;
      }

      return chunkWord.trim();
    }
  }

  const GeneratePDF = async () => {
    setLoading(true)
    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();

      // Register fontkit
      pdfDoc.registerFontkit(fontkit);

      // Add a page to the PDF
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 size

      const customFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

      // Draw text on the page
      const { width, height } = page.getSize();
      const fontSize = 12;

      const drawText = (text, x, y, size = 12, color = rgb(0, 0, 0)) => {
        page.drawText(text, { x, y, size, font: customFont, color, blendMode: BlendMode.Screen });
      };

      const lineHeight = 14;

      const shippingAddress = JSON.parse(data.shipping_address); // Parse the JSON string
      const orderItems = JSON.parse(data.order_items); // Parse the order items

      // Shop details
      drawText("VAARAHI MART", 50, height - 50, 16);
      drawText(
        "220/1661, PREM NAGAR 5th Lane,\nBESIDE PREM NAGAR PARK,\nBerhampur, Ganjam, Odisha, 760002.",
        50,
        height - 70
      );
      drawText("GSTIN/UIN: 21AAZFV0485F1ZV | State Code: 21", 50, height - 160);
      drawText("Contact: +91-9692000170 | E-Mail: vaarahimart@gmail.com", 50, height - 140);

      // Buyer details
      drawText(`${data.name}`, 50, height - 190, 16);
      drawText(
        `${shippingAddress.name}\n${shippingAddress.address_line_one}, ${shippingAddress.address_line_two}\n` +
        `${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}`,
        50,
        height - 230
      );
      drawText(`Contact: +91-${shippingAddress.phone_no}`, 50, height - 300);

      // Invoice details
      drawText(`Invoice No.: ${data.order_id}`, 300, height - 220);
      drawText(`Dated: ${new Date(data.createdAt).toLocaleDateString()}`, 300, height - 240);

      // Table headers
      const tableTop = height - 330;
      drawText("Sl", 50, tableTop, 12, rgb(0, 0, 0));
      drawText("Product Name", 100, tableTop);
      drawText("Unit", 400, tableTop);
      drawText("Quantity", 300, tableTop);
      drawText("Amount", 500, tableTop);

      // Table content
      let currentY = tableTop - lineHeight;
      orderItems.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        drawText((index + 1).toString(), 50, currentY); // Convert index to string
        drawText(item.product_name, 100, currentY);
        drawText(`${item.weight} ${item.units}`, 400, currentY); // Use string interpolation
        drawText(item.qty.toString(), 300, currentY); // Convert quantity to string
        drawText(itemTotal.toFixed(2).toString(), 500, currentY); // Convert total to string
        currentY -= lineHeight;
      });

      // Tax details
      const cgst = 5.49152; // Example CGST value
      const sgst = 5.49152; // Example SGST value
      drawText(`CGST:\t Rs ${cgst.toFixed(2)}`, 400, currentY - lineHeight);
      drawText(`SGST:\t Rs ${sgst.toFixed(2)}`, 400, currentY - 2 * lineHeight);
      drawText(`Total:\t Rs ${data.total_amt.toFixed(2)}`, 400, currentY - 3 * lineHeight);

      // Footer
      drawText(`Amount Chargeable (in words): INR ${convertNumberToWords(data.total_amt)} Only`, 50, 80);
      drawText("Terms and Conditions:", 50, 60);
      drawText("Payment due in 30 days; 1.5% monthly late fee applies.", 50, 40);

      // Utility function to convert numbers to words (simplified)

      // Serialize the PDF to Uint8Array
      const pdfBytes = await pdfDoc.save();

      // Convert Uint8Array to base64 using Buffer
      const pdfBase64 = Buffer.from(pdfBytes).toString('base64');

      // Define the path to save the file
      const path = `${RNFS.DocumentDirectoryPath}/Invoice.pdf`;

      // Save the PDF as a base64 file
      await RNFS.writeFile(path, pdfBase64, 'base64');
      FileViewer.open(path) // absolute-path-to-my-local-file.
        .then(() => {
          Alert.alert("show")
          // success
        })
        .catch((error) => {
          Alert.alert("error : ", error)

        }
        );
      Alert.alert('PDF Generated', `Invoice saved to: ${path}`);
    } catch (error) {
      console.log('Error', `Failed to generate PDF: ${error.message}`);
    } finally {
      setLoading(false)
    }
  };

  return (

    <View style={{ marginTop: 15, marginEnd: 15 }}>
      <TouchableOpacity onPress={GeneratePDF} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        {loading ? <ActivityIndicator /> : <Text style={styles.buttonText}>Generate Order PDF
          <MaterialCommunityIcons name="file" size={16} color="red" style={{ marginLeft: 15 }} />
        </Text>}
      </TouchableOpacity>
    </View>
  )
};

export default EstimateTemplate;

const styles = StyleSheet.create({
  button: {
    borderRadius: 5, justifyContent: "flex-end",
    alignSelf: "flex-end",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#A63A50',
    fontSize: 12,
    alignSelf: "flex-end",
    alignItems: "flex-end", marginTop: 5,
    fontWeight: 'bold',
  },
});
