// Pricing Rules:
// 1 vCPU = ₹450/month
// 1 GB RAM = ₹85/month
// 50 GB SSD = ₹100/month

export const calculateDynamicPricing = (message) => {
  const lowerMsg = message.toLowerCase();
  
  // Regex to extract numbers before "vcpu", "gb ram", "gb ssd"
  // Handles variations like "4 vcpu", "4vcpu", "8 gb ram", "200gb ssd"
  const vcpuMatch = lowerMsg.match(/(\d+)\s*vcpu/);
  const ramMatch = lowerMsg.match(/(\d+)\s*gb\s*ram/);
  const ssdMatch = lowerMsg.match(/(\d+)\s*gb\s*ssd/);

  if (vcpuMatch || ramMatch || ssdMatch) {
    let responseText = "Here is the custom pricing breakdown for your request:\n\n";
    let total = 0;

    if (vcpuMatch) {
      const vcpu = parseInt(vcpuMatch[1]);
      const cost = vcpu * 450;
      responseText += `CPU (${vcpu} vCPU): ₹${cost}\n`;
      total += cost;
    }

    if (ramMatch) {
      const ram = parseInt(ramMatch[1]);
      const cost = ram * 85;
      responseText += `RAM (${ram} GB): ₹${cost}\n`;
      total += cost;
    }

    if (ssdMatch) {
      const ssd = parseInt(ssdMatch[1]);
      // Assuming SSD cost is calculated in blocks of 50GB.
      // E.g., 200 / 50 = 4 blocks -> 4 * 100 = 400.
      const cost = (ssd / 50) * 100;
      responseText += `SSD (${ssd} GB): ₹${cost}\n`;
      total += cost;
    }

    responseText += `\n**Total: ₹${total}/month**`;

    return {
      text: responseText,
      relatedLinks: [
        { text: 'Deploy Public Cloud', url: '/cloud/public-cloud' },
        { text: 'Contact Sales', url: '/contact' }
      ]
    };
  }

  return null; // Return null if no pricing entities found
};
