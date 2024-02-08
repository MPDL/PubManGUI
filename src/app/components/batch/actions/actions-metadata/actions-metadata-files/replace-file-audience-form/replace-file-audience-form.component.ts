import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'pure-replace-file-audience-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './replace-file-audience-form.component.html',
})
export class ReplaceFileAudienceFormComponent {

  ous = Ous;

  constructor(private fb: FormBuilder) { }

  // replaceFileAudience(List<String> itemIds, List<String> ipRange, String userId, String token);
  public replaceFileAudienceForm: FormGroup = this.fb.group({
    ipRanges: this.fb.array([])
  });

  public ipRange: FormControl = new FormControl('', Validators.required);


  isValidField(form: FormGroup, field: string): boolean | null {
    return form.controls[field].errors
      && form.controls[field].touched;
  }

  isValidFieldInArray(formArray: FormArray, index: number) {
    return formArray.controls[index].errors
      && formArray.controls[index].touched;
  }

  getFieldError(form: FormGroup, field: string): string | null {
    if (!form.controls[field]) return null;

    const errors = form.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'A value is required!';

        case 'minlength':
          return `At least ${errors['minlength'].requiredLength} characters required!`;
      }
    }

    return null;
  }

  onSubmit(): void {
    if (this.replaceFileAudienceForm.invalid) {
      this.replaceFileAudienceForm.markAllAsTouched();
      return;
    }

    console.log(this.replaceFileAudienceForm.value);
  }


  // IP ranges
  get ipRangesToAdd() {
    return this.replaceFileAudienceForm.get('ipRanges') as FormArray;
  }

  onAddToNewIPRanges(): void {
    // Check no duplicates
    console.log("new IP range " + this.ipRange.value);
    if (this.ipRange.invalid) return;
    console.log("new IP range " + this.ipRange.value);
    const range = this.ipRange.value;
    console.log("new IP range " + range);
    this.ipRangesToAdd.push(
      this.fb.control(range, Validators.required)
    );

    this.ipRange.reset();
  }

  onDeleteIPRange(index: number): void {
    this.ipRangesToAdd.removeAt(index);
  }

  getIDsOfIPRange(): { value: {} } {

    let ipRanges = [];

    for (let range of this.ipRangesToAdd.controls) {
      ipRanges.push(this.ous.find(x => x.label === range.value)!.id);
    }

    return { value: { ipRanges } };
  }

}

// TO-DO
export const Ous = [
  {
    id: "mpg",
    label: "Max Planck Society (every institute)"
  },
  {
    id: "100",
    label: "Administrative Headquarters of the Max Planck Society, MPGV"
  },
  {
    id: "375",
    label: "Art History Institute in Florence - Max-Planck-Institute, MFKH"
  },
  {
    id: "366",
    label: "Bibliotheca Hertziana - Max Planck Institute for Art History, MRBH"
  },
  {
    id: "830",
    label: "Ernst Strüngmann Institute for Neuroscience in Cooperation with Max Planck Society (ESI), MFES"
  },
  {
    id: "307",
    label: "Friedrich Miescher Laboratory of the Max Planck Society, MTFM"
  },
  {
    id: "339",
    label: "Fritz Haber Institute of the Max Planck Society, MBFH"
  },
  {
    id: "806",
    label: "German Climate Computation Center (DKRZ), MHKR"
  },
  {
    id: "200",
    label: "Max Planck Digital Library, MPDL"
  },
  {
    id: "389",
    label: "Max Planck Florida Institute for Neuroscience, MJNS"
  },
  {
    id: "251",
    label: "Max Planck Innovation, MMGI"
  },
  {
    id: "330",
    label: "Max Planck Institute for Astronomy, MHAS"
  },
  {
    id: "331",
    label: "Max Planck Institute for Astrophysics, MGAS"
  },
  {
    id: "332",
    label: "Max Planck Institute for Biogeochemistry, MJBK"
  },
  {
    id: "313",
    label: "Max Planck Institute for Biological Cybernetics, MTBK"
  },
  {
    id: "329",
    label: "Max Planck Institute for Biological Intelligence, MMBI"
  },
  {
    id: "305",
    label: "Max Planck Institute for Biology Tübingen, MTEB"
  },
  {
    id: "458",
    label: "Max Planck Institute for Brain Research and Max Planck Reseach Unit for Neurogenetics, MFHR"
  },
  {
    id: "322",
    label: "Max Planck Institute for Chemical Ecology, MJCO"
  },
  {
    id: "394",
    label: "Max Planck Institute for Chemical Energy Conversion, MPSC"
  },
  {
    id: "351",
    label: "Max Planck Institute for Chemical Physics of Solids, MPCP"
  },
  {
    id: "333",
    label: "Max Planck Institute for Chemistry (Otto Hahn Institute), MPCH"
  },
  {
    id: "343",
    label: "Max Planck Institute for Coal Research, MPKH"
  },
  {
    id: "382",
    label: "Max Planck Institute for Comparative Public Law and International Law, MHAV"
  },
  {
    id: "377",
    label: "Max Planck Institute for Comparative and International Private Law, MHAP"
  },
  {
    id: "368",
    label: "Max Planck Institute for Demographic Research, MRDF"
  },
  {
    id: "336",
    label: "Max Planck Institute for Dynamics and Self-Organization, MPSF"
  },
  {
    id: "335",
    label: "Max Planck Institute for Dynamics of Complex Technical Systems, MMDT"
  },
  {
    id: "398",
    label: "Max Planck Institute for Empirical Aesthetics, MFAE"
  },
  {
    id: "365",
    label: "Max Planck Institute for Evolutionary Anthropology, MLEA"
  },
  {
    id: "314",
    label: "Max Planck Institute for Evolutionary Biology, MPLM"
  },
  {
    id: "353",
    label: "Max Planck Institute for Extraterrestrial Physics, MGEP"
  },
  {
    id: "376",
    label: "Max Planck Institute for Geoanthropology, MJWS"
  },
  {
    id: "340",
    label: "Max Planck Institute for Gravitational Physics (Albert Einstein Institute), MPGR"
  },
  {
    id: "309",
    label: "Max Planck Institute for Heart and Lung Research (W. G. Kerckhoff Institute), MNPK"
  },
  {
    id: "374",
    label: "Max Planck Institute for Human Cognitive and Brain Sciences, MLNP"
  },
  {
    id: "367",
    label: "Max Planck Institute for Human Development, MBBF"
  },
  {
    id: "312",
    label: "Max Planck Institute for Infection Biology, MBIB"
  },
  {
    id: "341",
    label: "Max Planck Institute for Informatics, MSIN"
  },
  {
    id: "456",
    label: "Max Planck Institute for Intellectual Property Rights and Max Planck Institute for Tax Law, MMAP"
  },
  {
    id: "360",
    label: "Max Planck Institute for Intelligent Systems, MSMT"
  },
  {
    id: "337",
    label: "Max Planck Institute for Iron Research, MDES"
  },
  {
    id: "379",
    label: "Max Planck Institute for Legal History and Legal Theory, MFER"
  },
  {
    id: "317",
    label: "Max Planck Institute for Marine Microbiology, MBMM"
  },
  {
    id: "346",
    label: "Max Planck Institute for Mathematics in the Sciences, MLMN"
  },
  {
    id: "345",
    label: "Max Planck Institute for Mathematics, MBMT"
  },
  {
    id: "316",
    label: "Max Planck Institute for Medical Research, MHMF"
  },
  {
    id: "321",
    label: "Max Planck Institute for Metabolism Research, MKNF"
  },
  {
    id: "348",
    label: "Max Planck Institute for Meteorology, MHMT"
  },
  {
    id: "301",
    label: "Max Planck Institute for Molecular Biomedicine, MMVB"
  },
  {
    id: "308",
    label: "Max Planck Institute for Molecular Genetics, MBMG"
  },
  {
    id: "445",
    label: "Max Planck Institute for Multidisciplinary Sciences, MGMN"
  },
  {
    id: "444",
    label: "Max Planck Institute for Neurobiology of Behavior – caesar, ZBCS"
  },
  {
    id: "342",
    label: "Max Planck Institute for Nuclear Physics, MHKP"
  },
  {
    id: "350",
    label: "Max Planck Institute for Physics (Werner Heisenberg Institute), MMPH"
  },
  {
    id: "328",
    label: "Max Planck Institute for Plant Breeding Research, MKZF"
  },
  {
    id: "354",
    label: "Max Planck Institute for Plasma Physics, MPPL"
  },
  {
    id: "355",
    label: "Max Planck Institute for Polymer Research, MMPL"
  },
  {
    id: "378",
    label: "Max Planck Institute for Psycholinguistics, MNPL"
  },
  {
    id: "357",
    label: "Max Planck Institute for Radio Astronomy, MBRA"
  },
  {
    id: "371",
    label: "Max Planck Institute for Research on Collective Goods, MBRG"
  },
  {
    id: "9351",
    label: "Max Planck Institute for Security and Privacy, MBCY"
  },
  {
    id: "369",
    label: "Max Planck Institute for Social Anthropology, MHET"
  },
  {
    id: "380",
    label: "Max Planck Institute for Social Law and Social Policy, MMAS"
  },
  {
    id: "358",
    label: "Max Planck Institute for Software Systems, MSSO"
  },
  {
    id: "359",
    label: "Max Planck Institute for Solar System Research, MPAE"
  },
  {
    id: "338",
    label: "Max Planck Institute for Solid State Research, MSFK"
  },
  {
    id: "318",
    label: "Max Planck Institute for Terrestrial Microbiology, MMTM"
  },
  {
    id: "388",
    label: "Max Planck Institute for the Biology of Ageing, MKBA"
  },
  {
    id: "383",
    label: "Max Planck Institute for the History of Science, MBWG"
  },
  {
    id: "352",
    label: "Max Planck Institute for the Physics of Complex Systems, MDPK"
  },
  {
    id: "387",
    label: "Max Planck Institute for the Science of Light, MELI"
  },
  {
    id: "399",
    label: "Max Planck Institute for the Structure and Dynamics of Matter, MHSD"
  },
  {
    id: "381",
    label: "Max Planck Institute for the Study of Crime, Security and Law, MFAS"
  },
  {
    id: "384",
    label: "Max Planck Institute for the Study of Religious and Ethnic Diversity, MPGS"
  },
  {
    id: "373",
    label: "Max Planck Institute for the Study of Societies, MKGS"
  },
  {
    id: "319",
    label: "Max Planck Institute of Animal Behavior, MKAB"
  },
  {
    id: "386",
    label: "Max Planck Institute of Biochemistry, MMBC"
  },
  {
    id: "302",
    label: "Max Planck Institute of Biophysics, MFBP"
  },
  {
    id: "344",
    label: "Max Planck Institute of Colloids and Interfaces, MTKG"
  },
  {
    id: "311",
    label: "Max Planck Institute of Immunobiology and Epigenetics, MFIB"
  },
  {
    id: "349",
    label: "Max Planck Institute of Microstructure Physics, MHMP"
  },
  {
    id: "327",
    label: "Max Planck Institute of Molecular Cell Biology and Genetics, MDMZ"
  },
  {
    id: "325",
    label: "Max Planck Institute of Molecular Physiology, MDMP"
  },
  {
    id: "324",
    label: "Max Planck Institute of Molecular Plant Physiology, MBMP"
  },
  {
    id: "326",
    label: "Max Planck Institute of Psychiatry, MMPS"
  },
  {
    id: "356",
    label: "Max Planck Institute of Quantum Optics, MGQO"
  },
  {
    id: "430",
    label: "Max Planck Institute&nbsp;Luxembourg for International, European and Regulatory Procedural Law, MLRP"
  },
  {
    id: "403",
    label: "Max Planck Unit for the Science of Pathogens, MBSP"
  },
  {
    id: "220",
    label: "Society for Scientific Data Processing Göttingen, GWDG"
  }
]
