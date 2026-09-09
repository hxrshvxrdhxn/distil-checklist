const SECTIONS = [
  { n: 1, title: "Biodiesel chain order", items: [
    ["1.1","Methanol recovery comes before the methyl-ester wash"],
    ["1.2","The methyl-ester wash comes before ME distillation"],
    ["1.3","ME distillation is the last step before product"],
    ["1.4","There are two separate washes: a crude-oil wash in pre-treatment, and a methyl-ester wash after transesterification"],
    ["1.5","On a high-FFA feed, pre-treatment is gum conditioning only, with no acid dosing and no lye"],
    ["1.6","Glycerolysis runs before the vacuum deodoriser"],
    ["1.7","The vacuum deodoriser runs before transesterification"],
    ["1.8","Feed must be dry before transesterification"],
    ["1.9","Glycerine recovery is the last section in the plant"]
  ]},
  { n: 2, title: "FFA thresholds", items: [
    ["2.1","Below 1% FFA, feed goes straight to alkali transesterification"],
    ["2.2","Between 3% and 15% FFA, physical stripping or single-stage acid esterification comes first"],
    ["2.3","Above 40 to 50% FFA, glycerolysis is mandatory rather than optional"],
    ["2.4","Caustic neutralising must never be used above 40% FFA"],
    ["2.5","__NUM__The highest FFA the deodoriser can accept","%"]
  ]},
  { n: 3, title: "Multi-feed enquiries", items: [
    ["3.1","A multi-feed biodiesel enquiry usually means high-FFA material such as PFAD, acid oil, used cooking oil or tallow"],
    ["3.2","When FFA is not stated, the plant should be designed for the worst feed in the slate"],
    ["3.3","The guaranteed output specification is uniform across all feeds in the slate"],
    ["3.4","The input specification varies per feed"],
    ["3.5","A proposal should not be quoted at all until the feed FFA is known"],
    ["3.6","__NUM__If FFA is unknown, the figure assumed today","%"]
  ]},
  { n: 4, title: "Standalone sections", items: [
    ["4.1","Transesterification is sold as a standalone section"],
    ["4.2","Where it is, pre-treatment then falls in the customer's scope"],
    ["4.3","A standalone transesterification offer still needs both washes"],
    ["4.4","Deacidification-cum-deodorisation is sold standalone"],
    ["4.5","Methyl-ester distillation is sold standalone"],
    ["4.6","Glycerine recovery is sold standalone"]
  ]},
  { n: 5, title: "Materials of construction", items: [
    ["5.1","Oil-wetted lines and light vessels are SS 304"],
    ["5.2","Acid service, phosphoric and citric, is SS 316 or 316L"],
    ["5.3","Sparge and stripping steam contact is SS 316 or 316L"],
    ["5.4","SS 304 in acid service is an engineering error, not a cost choice"],
    ["5.5","Positive-displacement pump rotors are carbon-steel body with SS 410 rotor, or all-SS"],
    ["5.6","Water, non-contact steam and structures are carbon steel"],
    ["5.7","Filter-press plates are virgin polypropylene"],
    ["5.8","Deodoriser heating media is thermal oil"],
    ["5.9","Valve bodies in oil lines are carbon steel with an SS 304 ball"]
  ]},
  { n: 6, title: "Safety and hazardous service", items: [
    ["6.1","Sections handling methanol require hazardous-area classification"],
    ["6.2","Sections handling hexane require hazardous-area classification"],
    ["6.3","Flameproof electricals fall in Mectech's scope"],
    ["6.4","Hazardous-area classification is stated in the proposal today"],
    ["6.5","Methanol storage requires nitrogen blanketing"],
    ["6.6","Nitrogen blanketing falls in Mectech's scope"],
    ["6.7","Vacuum vessels are designed for external pressure"],
    ["6.8","Relief devices fall in Mectech's scope"],
    ["6.9","Hydrogen handling provisions fall in Mectech's scope"],
    ["6.10","Thermal-oil systems include over-temperature protection"],
    ["6.11","A proposal should be stopped where a flammable section carries no hazardous-area statement"],
    ["6.12","__TEXT__The hazardous-area code you design to",""]
  ]},
  { n: 7, title: "Utilities", items: [
    ["7.1","Steam pressure is selected by duty, rather than one pressure across the plant"],
    ["7.2","Chilled water is required wherever crystallisation or dewaxing is in scope"],
    ["7.3","Instrument air is required wherever PLC control is in scope"],
    ["7.4","Vacuum is required wherever a deodoriser or distillation column is in scope"],
    ["7.5","Utility consumption is quoted per ton, and the rate does not change with capacity"],
    ["7.6","The boiler is normally the customer's scope"],
    ["7.7","The cooling tower is normally the customer's scope"],
    ["7.8","The chiller is normally Mectech's scope"]
  ]},
  { n: 8, title: "Effluent and residues", items: [
    ["8.1","Wash-water disposal is the customer's scope"],
    ["8.2","Spent bleaching earth handling is the customer's scope"],
    ["8.3","Sweet water from splitting routes to glycerine recovery"],
    ["8.4","Soapstock handling is the customer's scope"],
    ["8.5","Effluent treatment is always excluded"]
  ]},
  { n: 9, title: "Sparing", items: [
    ["9.1","Critical pumps are quoted with an installed spare"],
    ["9.2","Commissioning spares are included in the base price"],
    ["9.3","Two-year spares are quoted separately"]
  ]},
  { n: 10, title: "Capacity and scaling", items: [
    ["10.1","Vessel volume, pump capacity and exchanger area scale smoothly with capacity"],
    ["10.2","Vessel counts and filter counts step at thresholds rather than scaling smoothly"],
    ["10.3","PLC, flow meters and transmitters do not change with capacity"],
    ["10.4","Item codes stay the same across capacities"],
    ["10.5","Equipment is skid-mounted below a capacity threshold and field-erected above it"],
    ["10.6","__NUM__Where that threshold sits","TPD"]
  ]},
  { n: 11, title: "Product codes", items: [
    ["11.1","Biodiesel plants carry the code BD"],
    ["11.2","Esterification and glycerolysis share the code EST"],
    ["11.3","Glycerolysis should have its own code"],
    ["11.4","__TEXT__If it should, the code to use",""]
  ]},
  { n: 12, title: "Drawings", items: [
    ["12.1","A process flow diagram is normally included in the proposal"],
    ["12.2","A P&ID is not a proposal deliverable"],
    ["12.3","Equipment tag numbers on the drawing match the annexure exactly"],
    ["12.4","Tag legends exist as tables, not only inside CAD files"]
  ]}
];
