# DATASET LICENSE — Zazi Captioner Dataset
### Based on OpenRAIL-M with Extended Personal Data & Image Protection Provisions

**Version 1.0 — 2024**
**Copyright © [Your Name / Organisation]. All rights reserved.**

---

## PREAMBLE

This license governs the use of any dataset produced using the Zazi Captioner tool, including all images, caption files, metadata, and any derivative works produced from them ("the Dataset").

This license exists to:
- Protect the personal data and likeness of individuals appearing in submitted images
- Protect the intellectual property rights of photographers who submitted images
- Restrict the use of the Dataset to ethical, non-harmful AI research and training
- Ensure compliance with the **Protection of Personal Information Act, 2013 (POPIA)** of South Africa and other applicable data protection frameworks including GDPR where relevant

By accessing, downloading, using, or training any model on this Dataset, you agree to all terms stated in this license. If you do not agree, you may not use the Dataset.

---

## PART 1 — IMAGE AND PERSONAL DATA PROTECTIONS

### 1.1 Privacy of Individuals Depicted

The Dataset may contain photographs of real, identifiable individuals. These individuals have not consented to unlimited use of their likeness. Therefore:

- You **may not** use the Dataset or any model trained on it to identify, track, surveil, or profile any individual depicted in the images
- You **may not** use the Dataset to generate synthetic images that realistically depict, impersonate, or approximate any specific individual shown in the source images
- You **may not** use the Dataset to create deepfakes, non-consensual intimate imagery, or any content that misrepresents a depicted individual
- You **may not** use facial recognition, biometric analysis, or any identity-extraction technique on the Dataset images

### 1.2 Photographer Rights

All images in the Dataset remain the intellectual property of the photographer who submitted them. This license does not transfer ownership of any image. Therefore:

- You **may not** redistribute, sell, sublicense, or publish the raw source images from the Dataset separately from the trained model
- You **may not** use the images for any purpose other than training the AI model for which access was granted
- You **must** delete all raw source images from your systems once training is complete, retaining only the trained model weights
- Credit to the contributing photographers must be preserved in any publication, paper, or release that references this Dataset

### 1.3 POPIA Compliance

Any party accessing or processing this Dataset must comply with the Protection of Personal Information Act, 2013 (POPIA). This includes:

- Designating a responsible person (Information Officer) for data processing
- Processing personal data only for the specific, explicitly stated purpose for which access was granted
- Not retaining personal data beyond the period necessary to fulfil that purpose
- Implementing appropriate technical and organisational measures to prevent unauthorised access, loss, or destruction of the data
- Notifying the dataset controller immediately in the event of a data breach involving images from this Dataset

### 1.4 Cross-Border Data Transfers

If you are located outside of South Africa, you may only process this Dataset if your country or organisation provides a comparable level of personal data protection to that required by POPIA. Processing this Dataset in jurisdictions with inadequate data protection laws is prohibited without explicit written consent from the dataset controller.

---

## PART 2 — PERMITTED USES

You are permitted to use this Dataset only for:

- **Academic and non-commercial AI research** — training, fine-tuning, or evaluating generative image models for research purposes
- **Bias correction and representation research** — work specifically aimed at improving the representation of African cities, cultures, architecture, and people in AI-generated imagery
- **Non-commercial artistic and creative projects** — where the trained model is not sold, monetised, or used to produce commercial outputs
- **Educational use** — teaching or demonstrating AI training pipelines in non-commercial educational settings

All permitted uses require that you:
- Cite this Dataset and its contributors in any publication or release
- Share any research findings, papers, or model cards that result from use of this Dataset
- Notify the dataset controller of any public release of a model trained on this Dataset

---

## PART 3 — PROHIBITED USES

The following uses are strictly prohibited regardless of intent:

- **Commercial use** — selling, licensing, or monetising the Dataset itself or any model trained primarily on it
- **Surveillance and tracking** — using the Dataset or derived models to identify, locate, or monitor individuals
- **Harmful content generation** — using derived models to generate content that is violent, sexually explicit, hateful, defamatory, or that targets individuals or groups
- **Misinformation** — using derived models to generate fake news, fabricated events, or misleading depictions of real places or people
- **Discrimination** — using derived models in hiring, lending, law enforcement, housing, healthcare, or any decision-making context affecting people's rights or access to services
- **Military or weapons applications** — any use related to weapons development, military targeting, or warfare
- **Re-identification** — any attempt to reverse-engineer the identity of individuals depicted in the Dataset
- **Redistribution of raw data** — sharing, publishing, or selling the source images or caption files to any third party

---

## PART 4 — DATA SECURITY OBLIGATIONS

Any party granted access to this Dataset must:

- Store the Dataset on **encrypted storage** at rest (AES-256 or equivalent)
- Transmit the Dataset only over **encrypted channels** (TLS 1.2 or higher)
- Restrict access to the Dataset to **only those individuals** directly involved in the permitted training task
- Maintain an **access log** recording who accessed the Dataset and when
- **Delete all copies** of the Dataset, including backups, within 30 days of completing the permitted training task, unless a longer retention period has been agreed in writing with the dataset controller

---

## PART 5 — TOOL INPUT DATA — ZERO RETENTION DECLARATION

The Zazi Captioner tool that produced this Dataset is designed with the following privacy properties:

- **No images are uploaded to any server** at any time during the captioning process
- **All processing occurs locally** in the photographer's browser
- **No image data, caption data, or metadata** is transmitted to or stored by the tool developer or any third party
- The tool has **no backend, no database, and no analytics**

This declaration applies to the tool as distributed. If you deploy a modified version of the tool, you must not introduce any server-side image storage, analytics, or data collection without explicit informed consent from every user of that modified version.

---

## PART 6 — ATTRIBUTION REQUIREMENTS

Any publication, model card, research paper, or public release that uses this Dataset or a model trained on it must include the following attribution:

```
Dataset produced using the Zazi Captioner tool.
© [Your Name / Organisation], [Year].
Contributing photographers retain all rights to their original images.
Licensed under the Zazi Captioner Dataset License v1.0.
```

---

## PART 7 — ENFORCEMENT AND VIOLATIONS

Violation of any term of this license:

- Immediately and automatically **terminates your right** to use the Dataset
- Requires you to **delete all copies** of the Dataset and any models trained on it within 7 days of the violation
- May result in **legal action** under applicable intellectual property law, data protection law (POPIA), and privacy law
- Must be **reported to the dataset controller** in writing within 48 hours if you discover a third party violating these terms

---

## PART 8 — DISCLAIMER

THE DATASET IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. THE DATASET CONTROLLER MAKES NO REPRESENTATIONS ABOUT THE ACCURACY, COMPLETENESS, OR FITNESS FOR ANY PARTICULAR PURPOSE OF THE DATASET. THE DATASET CONTROLLER IS NOT LIABLE FOR ANY DAMAGES ARISING FROM USE OF THE DATASET.

---

## CONTACT

To request access, report a violation, or seek written permission for uses not covered by this license, contact:

**Dataset Controller:** [Your Name]
**Organisation:** [Your Organisation]
**Email:** [Your Email]
**Location:** Johannesburg, South Africa

---

*This license was written in accordance with the OpenRAIL-M responsible AI licensing framework and the Protection of Personal Information Act, 2013 (POPIA) of South Africa. It is not a substitute for legal advice. Consult a qualified attorney for your specific circumstances.*
