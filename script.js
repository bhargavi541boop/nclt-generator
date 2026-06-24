
    /* ══════════════════════════════════════════════════════════
       APPLICATION TYPES
    ══════════════════════════════════════════════════════════ */
    window.APPLICATION_TYPES = [
      "IA_CA","REV_CA","REST_APP_CA","CROSS_CA","MA_CA","CA_CA","CAA_CA","TA_CA",
      "CA_IBC","IA_IBC","REV_IBC","REST_APP_IBC","CROSS_IBC","MA_IBC",
      "IA_IBC_PLAN","IA_IBC_LIQ","IA_IBC_DIS","IA_LIQ_PROGRESS"
    ];

    /* ══════════════════════════════════════════════════════════
       FORMATTERS
    ══════════════════════════════════════════════════════════ */
    function formatPartyTitle(parties) {
      if (!parties || !parties.length) return "";
      const v = parties.filter(p => p.name && p.name.trim());
      if (!v.length) return "";
      if (v.length === 1) return v[0].name;
      if (v.length === 2) return v[0].name + " & ANR.";
      return v[0].name + " & ORS.";
    }

    function formatBenchDisplay(bench) { return (bench || '').toUpperCase(); }

    function formatBenchShort(bench) {
      const map = { Mumbai:"MB", Delhi:"ND", Chennai:"CH", Kolkata:"KO", Ahmedabad:"AH", Bengaluru:"BN", Hyderabad:"HY", Jaipur:"JP" };
      return map[bench] || bench;
    }

    function formatCaseTypeDisplay(caseType) {
      const map = {
        CP_IBC:"COMPANY PETITION (IB)", CP_CA:"COMPANY PETITION (CA)", TP_CA:"TRANSFER PETITION (CA)",
        RP_CA:"REHABILITATION PETITION (CA)", IP_CA:"INTERVENTION PETITION (CA)", CONT_CA:"CONTEMPT PETITION (CA)",
        EXEC_CA:"EXECUTION PETITION (CA)", CPAA_CA:"COMPANY PETITION (AA)", REST_CP_CA:"RESTORED COMPANY PETITION (CA)",
        RP_IBC:"REHABILITATION PETITION (IB)", IP_IBC:"INTERVENTION PETITION (IB)", CONT_IBC:"CONTEMPT PETITION (IB)",
        TP_IBC:"TRANSFER PETITION (IB)", REST_CP_IBC:"RESTORED COMPANY PETITION (IB)",
        IA_CA:"INTERLOCUTORY APPLICATION (CA)", REV_CA:"REVIEW APPLICATION (CA)", REST_APP_CA:"RESTORATION APPLICATION (CA)",
        CROSS_CA:"CROSS APPLICATION (CA)", MA_CA:"MISCELLANEOUS APPLICATION (CA)", CA_CA:"COMPANY APPLICATION (CA)",
        CAA_CA:"COMPANY APPLICATION (AA)", TA_CA:"TRANSFER APPLICATION (CA)", CA_IBC:"COMPANY APPLICATION (IBC)",
        IA_IBC:"INTERLOCUTORY APPLICATION (IBC)", REV_IBC:"REVIEW APPLICATION (IBC)",
        REST_APP_IBC:"RESTORATION APPLICATION (IBC)", CROSS_IBC:"CROSS APPLICATION (IBC)",
        MA_IBC:"MISCELLANEOUS APPLICATION (IBC)", IA_IBC_PLAN:"INTERLOCUTORY APPLICATION (IBC) (PLAN)",
        IA_IBC_LIQ:"INTERLOCUTORY APPLICATION (IBC) (LIQ.)", IA_IBC_DIS:"INTERLOCUTORY APPLICATION (IBC) (DIS.)",
        IA_LIQ_PROGRESS:"IA (LIQ.) PROGRESS REPORT (IBC)"
      };
      return map[caseType] || caseType;
    }

    function formatDeponentLine(selectedParties, petitioners, respondents, appDetails) {
      if (!selectedParties || !selectedParties.length) return "";
      const applicantName        = appDetails?.applicant            ?? '';
      const applicantAddress     = appDetails?.applicantAddress     ?? '';
      const appRespondentName    = appDetails?.appRespondent        ?? '';
      const appRespondentAddress = appDetails?.appRespondentAddress ?? '';
      const grouped = {};
      selectedParties.forEach(entry => {
        const lastUnderscore = entry.lastIndexOf("_");
        const role   = entry.substring(0, lastUnderscore);
        const number = parseInt(entry.substring(lastUnderscore + 1));
        if (!grouped[role]) grouped[role] = [];
        grouped[role].push(number);
      });
      const output = [];
      Object.entries(grouped).forEach(([role, nums]) => {
        if (role === "Applicant") {
          output.push(`I, ${applicantName}, Applicant above named, currently residing at ${applicantAddress}`);
        } else if (role === "AppRespondent") {
          output.push(`I, ${appRespondentName}, Respondent above named, currently residing at ${appRespondentAddress}`);
        } else {
          const source  = role === "Petitioner" ? petitioners : respondents;
          const parties = nums.map(n => source[n - 1]);
          const names   = parties.map(p => p?.name);
          const addresses = parties.map(p => p?.address);
          if (nums.length === 1) {
            output.push(`I, ${names[0]}, ${role} above named, currently residing at ${addresses[0]}`);
          } else {
            output.push(`We, ${names.join(" and ")}, ${role} Nos. ${nums.join(" & ")}, having offices at ${addresses.join(" and ")}`);
          }
        }
      });
      return output.join(" and ");
    }

    /* ══════════════════════════════════════════════════════════
       DOM READ
    ══════════════════════════════════════════════════════════ */
    function readDomValues() {
      const caseType      = document.getElementById('caseType')?.value ?? '';
      const isApplication = APPLICATION_TYPES.includes(caseType);
      return {
        bench:        document.getElementById('bench')?.value        ?? '',
        benchNo:      document.getElementById('benchNo')?.value      ?? '',
        caseType,
        petitionNo:   document.getElementById('petitionNo')?.value   ?? '',
        petitionYear: document.getElementById('petitionYear')?.value ?? '',
        citation:     document.getElementById('citation')?.value     ?? '',
        advocateName:    document.getElementById('advocateName')?.value    ?? '',
        advocateAddress: document.getElementById('advocateAddress')?.value ?? '',
        advocateSide:    document.getElementById('advocateSide')?.value    ?? '',
        isApplication,
        applicationNo:        isApplication ? (document.getElementById('applicationNo')?.value        ?? '') : '',
        applicationYear:      isApplication ? (document.getElementById('applicationYear')?.value      ?? '') : '',
        applicant:            isApplication ? (document.getElementById('applicant')?.value            ?? '') : '',
        applicantAddress:     isApplication ? (document.getElementById('applicantAddress')?.value     ?? '') : '',
        appRespondent:        isApplication ? (document.getElementById('appRespondent')?.value        ?? '') : '',
        appRespondentAddress: isApplication ? (document.getElementById('appRespondentAddress')?.value ?? '') : '',
        petitioners: [...document.querySelectorAll('#petitioners .party-card')].map((card, i) => ({
          index:   i + 1,
          name:    card.querySelector('.partyName')?.value        ?? '',
          address: card.querySelectorAll('.field')[1]?.value      ?? '',
          type:    card.querySelector('.partyType')?.value        ?? ''
        })),
        respondents: [...document.querySelectorAll('#respondents .party-card')].map((card, i) => ({
          index:   i + 1,
          name:    card.querySelector('.partyName')?.value        ?? '',
          address: card.querySelectorAll('.field')[1]?.value      ?? '',
          type:    card.querySelector('.partyType')?.value        ?? ''
        })),
        vakalatnamaChecked: [...document.querySelectorAll('#vakalatnamaParties input[type="checkbox"]:checked')].map(cb => cb.value)
      };
    }

    function transformFormData(raw, docParties) {
      const { bench, benchNo, caseType, petitionNo, petitionYear, citation, advocateName, advocateAddress, advocateSide,
        isApplication, applicationNo, applicationYear, applicant, applicantAddress, appRespondent, appRespondentAddress,
        petitioners, respondents, vakalatnamaChecked } = raw;
      const appDetails = isApplication ? { applicant, applicantAddress, appRespondent, appRespondentAddress } : null;
      const deponentLine  = formatDeponentLine(docParties || [], petitioners, respondents, appDetails);
      const petitionAct   = caseType.includes("IBC") ? "IB" : "CA";
      const advocateLabel = advocateSide ? `ADVOCATE FOR THE ${advocateSide.toUpperCase()}` : '';
      let appearingParties = [];
      if      (advocateSide === "Petitioner") appearingParties = petitioners;
      else if (advocateSide === "Respondent") appearingParties = respondents;
      else if (advocateSide === "Applicant")  appearingParties = [{ name: applicant, address: applicantAddress }];
      return {
        caseDetails: { bench, benchNo, caseType, petitionNo, petitionYear, citation, advocateName, advocateAddress, advocateSide, advocateLabel, deponentLine, petitionAct },
        applicationDetails: isApplication ? { applicationNo, applicationYear, applicant, applicantAddress, appRespondent, appRespondentAddress } : null,
        petitioners, respondents, appearingParties, vakalatnamaChecked,
        petitionerTitle: formatPartyTitle(petitioners),
        respondentTitle: formatPartyTitle(respondents)
      };
    }

    function getFormData(docParties) { return transformFormData(readDomValues(), docParties); }

    function buildFlatPartyTags(parties, prefix) {
      const tags = {};
      for (let i = 1; i <= 5; i++) {
        const p = parties[i - 1];
        tags[`${prefix}${i}Name`]    = p?.name    ?? '';
        tags[`${prefix}${i}Address`] = p?.address ?? '';
        tags[`${prefix}${i}Type`]    = p?.type    ?? '';
      }
      return tags;
    }

    function buildTemplateData(data) {
      return {
        ...data.caseDetails,
        ...(data.applicationDetails || {}),
        petitionerTitle: data.petitionerTitle,
        respondentTitle: data.respondentTitle,
        petitioners:     data.petitioners,
        respondents:     data.respondents,
        bench:           formatBenchDisplay(data.caseDetails.bench),
        caseType:        formatCaseTypeDisplay(data.caseDetails.caseType),
        benchShort:      formatBenchShort(data.caseDetails.bench),
        ...buildFlatPartyTags(data.petitioners, 'petitioner'),
        ...buildFlatPartyTags(data.respondents, 'respondent')
      };
    }

    /* ══════════════════════════════════════════════════════════
       TEMPLATE FETCHING — always local folder
    ══════════════════════════════════════════════════════════ */
    async function fetchAndRenderTemplate(templatePath, templateData) {
      let arrayBuffer;
      try {
        const response = await fetch('templates/' + templatePath);
        if (!response.ok) {
          console.warn(`[NCLT] Template not found (${response.status}): "${templatePath}"`);
          return null;
        }
        arrayBuffer = await response.arrayBuffer();
      } catch (err) {
        console.warn(`[NCLT] Error fetching template "${templatePath}":`, err);
        return null;
      }
      const zip = new PizZip(arrayBuffer);
      const doc = new window.docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
      doc.setData(templateData);
      doc.render();
      return doc.getZip().generate({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    }

    async function buildBaseFiles(baseFiles, baseFolder, templateData, zipBundle) {
      const succeeded = [];
      for (const file of baseFiles) {
        const blob = await fetchAndRenderTemplate(baseFolder + file.templateName, templateData);
        if (!blob) continue;
        zipBundle.file(file.outputName, blob);
        succeeded.push(file.outputName);
      }
      return succeeded;
    }

    async function buildVakalatnamaFiles(vakalatnamaSelections, baseFolder, zipBundle) {
      const targets = vakalatnamaSelections.length ? vakalatnamaSelections : [null];
      const succeeded = [];
      for (const party of targets) {
        const vakData    = getFormData(party ? [party] : []);
        const vakTplData = buildTemplateData(vakData);
        const blob = await fetchAndRenderTemplate(baseFolder + "8. Vakalatnama.docx", vakTplData);
        if (!blob) continue;
        const outputName = party ? `8_Vakalatnama_${party}.docx` : "8_Vakalatnama.docx";
        zipBundle.file(outputName, blob);
        succeeded.push(outputName);
      }
      return succeeded;
    }

    async function generateFolder() {
      const mainBtn = document.getElementById('genMainBtn');
      const origText = mainBtn.innerHTML;
      mainBtn.disabled = true;
      mainBtn.innerHTML = '↻ &nbsp;Generating…';
      try {
        const vakalatnamaSelections = [...document.querySelectorAll('#vakalatnamaParties input[type="checkbox"]:checked')].map(cb => cb.value);
        const data          = getFormData([]);
        const isApplication = data.applicationDetails !== null;
        const baseFolder    = isApplication ? "Application/Other Pages/" : "Petition/Other Pages/";
        const { baseFiles } = buildFileList(isApplication);
        const templateData  = buildTemplateData(data);
        const zipBundle     = new JSZip();
        const baseSucceeded = await buildBaseFiles(baseFiles, baseFolder, templateData, zipBundle);
        const vakSucceeded  = await buildVakalatnamaFiles(vakalatnamaSelections, baseFolder, zipBundle);
        const allSucceeded  = [...baseSucceeded, ...vakSucceeded];
        if (allSucceeded.length === 0) {
          throw new Error(
            `No templates were found. Looked in: "${baseFolder}"\n\nExpected files:\n${baseFiles.map(f => '  • ' + f.templateName).join('\n')}\n  • 8. Vakalatnama.docx\n\nCheck that the templates folder exists and filenames match exactly.`
          );
        }
        const outputFolderName = buildOtherPagesFolderName(data);
        const zipBlob = await zipBundle.generateAsync({ type: "blob" });
        saveAs(zipBlob, `${outputFolderName}.zip`);
        alert(`Other Pages generated successfully.\n\nZIP: ${outputFolderName}.zip\nFiles generated: ${allSucceeded.length}\n\n${allSucceeded.join('\n')}`);
      } catch (error) {
        console.error(error);
        alert(`Error generating Other Pages.\n\n${error.message || error}`);
      } finally {
        mainBtn.disabled = false;
        mainBtn.innerHTML = origText;
      }
    }

    /* ══════════════════════════════════════════════════════════
       WIZARD STEP NAVIGATION
    ══════════════════════════════════════════════════════════ */
    let currentStep = 1;
    let maxVisitedStep = 1;
    const TOTAL_STEPS = 4;

    function goToStep(n) {
      if (n > maxVisitedStep) return;
      currentStep = n;
      renderStep();
    }

    function changeStep(dir) {
      currentStep = Math.max(1, Math.min(TOTAL_STEPS, currentStep + dir));
      if (currentStep > maxVisitedStep) maxVisitedStep = currentStep;
      renderStep();
    }

    function renderStep() {
      document.querySelectorAll('.step-body').forEach(b => b.classList.remove('active'));
      document.getElementById(`step-${currentStep}`).classList.add('active');
      for (let i = 1; i <= TOTAL_STEPS; i++) {
        const tab = document.getElementById(`tab-${i}`);
        tab.classList.remove('active','done');
        if (i === currentStep) tab.classList.add('active');
        else if (i <= maxVisitedStep) tab.classList.add('done');
      }
      const pct = (currentStep / TOTAL_STEPS) * 100;
      document.getElementById('progressFill').style.width = pct + '%';
      document.getElementById('navStepLabel').textContent = `Step ${currentStep} of ${TOTAL_STEPS}`;
      const btnBack = document.getElementById('btnBack');
      const btnNext = document.getElementById('btnNext');
      btnBack.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
      if (currentStep === TOTAL_STEPS) {
        btnNext.style.display = 'none';
        checkWarnBanner();
      } else {
        btnNext.style.display = '';
        btnNext.textContent = 'Next →';
      }
      if (currentStep === TOTAL_STEPS) updateVakalatnama();
    }

    function checkWarnBanner() {
      const emptyFields = [];
      document.querySelectorAll('#petitioners .partyName, #respondents .partyName').forEach(f => {
        if (!f.value.trim()) emptyFields.push(f.closest('.party-card').querySelector('.party-label').textContent);
      });
      const banner = document.getElementById('warnBanner');
      if (emptyFields.length) {
        document.getElementById('warnText').textContent = `Some fields are empty (${emptyFields.join(', ')}). Documents may have gaps.`;
        banner.classList.add('visible');
      } else {
        banner.classList.remove('visible');
      }
    }

    function dismissWarn() { document.getElementById('warnBanner').classList.remove('visible'); }

    /* ══════════════════════════════════════════════════════════
       CASE TYPE CHANGE
    ══════════════════════════════════════════════════════════ */
    function onCaseTypeChange() {
      const isApp = APPLICATION_TYPES.includes(caseType.value);
      document.getElementById('applicationBlock').style.display = isApp ? 'block' : 'none';
      const advocateSide = document.getElementById('advocateSide');
      if (!advocateSide) return;
      advocateSide.value = '';
      if (isApp) {
        advocateSide.innerHTML = `<option value="">— Select —</option><option value="Applicant">Applicant</option><option value="Respondent">Respondent</option>`;
      } else {
        advocateSide.innerHTML = `<option value="">— Select —</option><option value="Petitioner">Petitioner</option><option value="Respondent">Respondent</option>`;
      }
      updateVakalatnama();
    }

    /* ══════════════════════════════════════════════════════════
       PARTY MANAGEMENT
    ══════════════════════════════════════════════════════════ */
    function addParty(section, label) {
      const container = document.getElementById(section);
      const count = container.querySelectorAll('.party-card').length + 1;
      const div = document.createElement('div');
      div.className = 'party-card';
      div.dataset.section = section;
      div.dataset.index = count;
      div.innerHTML = `
        <div class="party-header">
          <span class="party-label">${label} ${count}</span>
          <button class="btn-remove" onclick="removeParty(this)">✕ Remove</button>
        </div>
        <div class="row col-3">
          <div>
            <label class="field-label">Name</label>
            <input class="field partyName" placeholder="Full legal name" oninput="updateVakalatnama()">
          </div>
          <div>
            <label class="field-label">Address</label>
            <textarea class="field" placeholder="Registered address" rows="2"></textarea>
          </div>
          <div>
            <label class="field-label">Type</label>
            <select class="field partyType">
              <option value="">— Select —</option>
              <option value="Company">Company</option>
              <option value="Individual">Individual</option>
              <option value="LLP">LLP</option>
              <option value="Partnership Firm">Partnership Firm</option>
              <option value="Trust">Trust</option>
            </select>
          </div>
        </div>`;
      container.appendChild(div);
      updateVakalatnama();
    }

    function removeParty(btn) {
      const card = btn.closest('.party-card');
      const container = card.parentElement;
      card.remove();
      const label = container.id === 'petitioners' ? 'Petitioner' : 'Respondent';
      container.querySelectorAll('.party-card').forEach((c, i) => {
        c.querySelector('.party-label').textContent = `${label} ${i + 1}`;
        c.dataset.index = i + 1;
      });
      updateVakalatnama();
    }

    /* ══════════════════════════════════════════════════════════
       VAKALATNAMA
    ══════════════════════════════════════════════════════════ */
    function updateVakalatnama() {
      const box = document.getElementById('vakalatnamaParties');
      const prev = new Set([...box.querySelectorAll('input[type="checkbox"]:checked')].map(cb => cb.value));
      let html = '';
      const isApp = APPLICATION_TYPES.includes(document.getElementById('caseType').value);
      if (isApp) {
        const an = document.getElementById('applicant')?.value.trim();
        const rn = document.getElementById('appRespondent')?.value.trim();
        if (an) html += `<div class="vak-item"><input type="checkbox" value="Applicant_1"${prev.has('Applicant_1')?' checked':''}> Applicant – ${an}</div>`;
        if (rn) html += `<div class="vak-item"><input type="checkbox" value="AppRespondent_1"${prev.has('AppRespondent_1')?' checked':''}> App. Respondent – ${rn}</div>`;
      }
      document.querySelectorAll('#petitioners .partyName').forEach((p, i) => {
        const v = `Petitioner_${i+1}`;
        if (p.value.trim()) {
          html += `<div class="vak-item"><input type="checkbox" value="${v}"${prev.has(v)?' checked':''}> Petitioner ${i+1} – ${p.value}</div>`;
        } else {
          html += `<div class="vak-item" style="opacity:0.55;"><input type="checkbox" value="${v}" disabled> Petitioner ${i+1} – <em style="color:var(--warn-text)">name not entered yet</em></div>`;
        }
      });
      document.querySelectorAll('#respondents .partyName').forEach((p, i) => {
        const v = `Respondent_${i+1}`;
        if (p.value.trim()) {
          html += `<div class="vak-item"><input type="checkbox" value="${v}"${prev.has(v)?' checked':''}> Respondent ${i+1} – ${p.value}</div>`;
        } else {
          html += `<div class="vak-item" style="opacity:0.55;"><input type="checkbox" value="${v}" disabled> Respondent ${i+1} – <em style="color:var(--warn-text)">name not entered yet</em></div>`;
        }
      });
      box.innerHTML = html || `<span class="vak-empty">Add parties in Step 2 to see options here.</span>`;
    }

    /* ══════════════════════════════════════════════════════════
       FILE LIST & FOLDER NAME
    ══════════════════════════════════════════════════════════ */
    function buildFileList(isApplication) {
      const baseFiles = isApplication
        ? [
            { templateName: "1. First Page.docx",                    outputName: "1_First_Page.docx" },
            { templateName: "2. Index.docx",                         outputName: "2_Index.docx" },
            { templateName: "3. List of Dates.docx",                 outputName: "3_List_of_Dates.docx" },
            { templateName: "4. Memo of Parties.docx",               outputName: "4_Memo_of_Parties.docx" },
            { templateName: "5. Synopsis.docx",                      outputName: "5_Synopsis.docx" },
            { templateName: "6. Memo of Registered Address.docx",    outputName: "6_Memo_of_Registered_Address.docx" },
            { templateName: "7. Affidavit.docx",                     outputName: "7_Affidavit.docx" },
            { templateName: "9. Docket.docx",                        outputName: "9_Docket.docx" }
          ]
        : [
            { templateName: "1. First Page.docx",                    outputName: "1_First_Page.docx" },
            { templateName: "2. Index.docx",                         outputName: "2_Index.docx" },
            { templateName: "3. List of Dates.docx",                 outputName: "3_List_of_Dates.docx" },
            { templateName: "4. Synopsis.docx",                      outputName: "4_Synopsis.docx" },
            { templateName: "5. Memo of Parties.docx",               outputName: "5_Memo_of_Parties.docx" },
            { templateName: "6.. Memo of Registered Address.docx",   outputName: "6_Memo_of_Registered_Address.docx" },
            { templateName: "7. Affidavit.docx",                     outputName: "7_Affidavit.docx" },
            { templateName: "9. Docket.docx",                        outputName: "9_Docket.docx" }
          ];
      const vakalatnamaSelections = [...document.querySelectorAll('#vakalatnamaParties input:checked')].map(cb => cb.value);
      return { baseFiles, vakalatnamaSelections };
    }

    function sanitizeFolderPart(value, fallback = "Untitled") {
      const cleaned = String(value || "").trim().replace(/[<>:"/\\|?*\x00-\x1F]/g,"").replace(/\s+/g,"_");
      return cleaned || fallback;
    }

    function buildOtherPagesFolderName(data) {
      const d = data.caseDetails || {};
      return `Other_Pages_${sanitizeFolderPart(d.caseType,"Case")}_${sanitizeFolderPart(d.petitionNo,"No")}_${sanitizeFolderPart(d.petitionYear,"Year")}`;
    }

    /* ══════════════════════════════════════════════════════════
       DOWNLOAD MODAL
    ══════════════════════════════════════════════════════════ */
    let currentDocName = '';

    function openModal(name, desc) {
      currentDocName = name;
      document.getElementById('modalTitle').textContent = name;
      document.getElementById('modalDesc').textContent = desc + '\n\nClick Download to save this document.';
      document.getElementById('docModal').classList.add('open');
    }

    function closeModal() {
      document.getElementById('docModal').classList.remove('open');
      currentDocName = '';
    }

    async function downloadDoc(docParties) {
      const docName = currentDocName;
      const data = getFormData(docParties || []);
      try {
        const isApplication = data.applicationDetails !== null;
        const folder = isApplication ? "Application" : "Petition";
        const templatePath = `${folder}/${docName.replace(/\s+/g,'_')}.docx`;
        const response = await fetch(`templates/${templatePath}`);
        if (!response.ok) throw new Error(`Template not found: "${templatePath}" (HTTP ${response.status})`);
        const arrayBuffer = await response.arrayBuffer();
        const zip = new PizZip(arrayBuffer);
        const doc = new window.docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
        doc.setData(buildTemplateData(data));
        doc.render();
        const blob = doc.getZip().generate({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
        saveAs(blob, `${docName.replace(/\s+/g,'_')}.docx`);
        closeModal();
      } catch (error) {
        console.error(error);
        alert(`Template generation failed.\n\n${error.message || error}`);
      }
    }

    function openPartySelector(docName) {
      currentDocName = docName;
      const list = document.getElementById("partySelectionList");
      let html = '<div class="party-check-list">';
      const isApp = APPLICATION_TYPES.includes(document.getElementById('caseType').value);
      if (isApp) {
        const an = document.getElementById('applicant')?.value.trim();
        const rn = document.getElementById('appRespondent')?.value.trim();
        if (an) html += `<label><input type="checkbox" value="Applicant_1"> Applicant – ${an}</label>`;
        if (rn) html += `<label><input type="checkbox" value="AppRespondent_1"> App. Respondent – ${rn}</label>`;
      }
      document.querySelectorAll('#petitioners .partyName').forEach((p, i) => {
        if (p.value.trim()) html += `<label><input type="checkbox" value="Petitioner_${i+1}"> Petitioner ${i+1} – ${p.value}</label>`;
      });
      document.querySelectorAll('#respondents .partyName').forEach((p, i) => {
        if (p.value.trim()) html += `<label><input type="checkbox" value="Respondent_${i+1}"> Respondent ${i+1} – ${p.value}</label>`;
      });
      html += '</div>';
      if (html === '<div class="party-check-list"></div>') {
        html = '<p style="font-size:13px;color:var(--muted-lt);margin:12px 0 20px">No parties added yet. Add petitioners or respondents first.</p>';
      }
      list.innerHTML = html;
      document.getElementById("partyModal").classList.add("open");
    }

    function closePartyModal() { document.getElementById("partyModal").classList.remove("open"); }
    function confirmPartySelection() {
      const selected = [...document.querySelectorAll('#partySelectionList input:checked')].map(cb => cb.value);
      closePartyModal();
      downloadDoc(selected);
    }

    /* ══════════════════════════════════════════════════════════
       SAVE / LOAD CASES — localStorage
    ══════════════════════════════════════════════════════════ */
    const CASES_KEY = 'nclt_cases';

    function getAllCases() {
      try { return JSON.parse(localStorage.getItem(CASES_KEY) || '{}'); }
      catch { return {}; }
    }

    function gatherState() {
      const raw = readDomValues();
      return {
        bench: raw.bench, benchNo: raw.benchNo, caseType: raw.caseType,
        petitionNo: raw.petitionNo, petitionYear: raw.petitionYear, citation: raw.citation,
        applicationNo: raw.applicationNo, applicationYear: raw.applicationYear,
        applicant: raw.applicant, applicantAddress: raw.applicantAddress,
        appRespondent: raw.appRespondent, appRespondentAddress: raw.appRespondentAddress,
        advocateName: raw.advocateName, advocateAddress: raw.advocateAddress, advocateSide: raw.advocateSide,
        petitioners: raw.petitioners, respondents: raw.respondents,
        vakalatnamaChecked: raw.vakalatnamaChecked,
        savedAt: new Date().toISOString()
      };
    }

    let _currentCaseName = null;

    /* ── Save Case Modal ── */
    function saveCase() {
      const modal = document.getElementById('saveCaseModal');
      document.getElementById('saveCaseNameInput').value = _currentCaseName || '';
      modal.classList.add('open');
      setTimeout(() => document.getElementById('saveCaseNameInput').focus(), 50);
    }

    function confirmSaveCase() {
      const input = document.getElementById('saveCaseNameInput');
      const caseName = input.value.trim();
      if (!caseName) { alert('Please enter a case name.'); return; }
      const btn = document.getElementById('saveCaseConfirmBtn');
      btn.disabled = true;
      btn.textContent = 'Saving...';
      try {
        const cases = getAllCases();
        cases[caseName] = gatherState();
        localStorage.setItem(CASES_KEY, JSON.stringify(cases));
        _currentCaseName = caseName;
        document.getElementById('saveCaseModal').classList.remove('open');
        showSaveStatus('Saved ✓');
      } catch (err) {
        alert('Failed to save: ' + err.message);
      } finally {
        btn.disabled = false;
        btn.textContent = 'Save';
      }
    }

    function closeSaveCaseModal() { document.getElementById('saveCaseModal').classList.remove('open'); }

    /* ── Load Case Modal ── */
    function loadCase() {
      const modal = document.getElementById('loadCaseModal');
      const list = document.getElementById('loadCaseList');
      modal.classList.add('open');
      const cases = getAllCases();
      const names = Object.keys(cases);
      if (!names.length) {
        list.innerHTML = '<div class="case-list-empty">No saved cases yet. Use "Save Case" to save your first case.</div>';
        return;
      }
      list.innerHTML = names.map(name => {
        const c = cases[name];
        const date = c.savedAt ? new Date(c.savedAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '';
        const safeName = name.replace(/'/g, "\\'");
        return `
          <div class="case-list-item">
            <div>
              <div class="case-list-name">${name}</div>
              <div class="case-list-date">Saved: ${date}</div>
            </div>
            <div class="case-list-actions">
              <button class="btn-navy" onclick="loadCaseByName('${safeName}')">Load</button>
              <button class="btn-remove" onclick="deleteCaseByName('${safeName}')">✕ Delete</button>
            </div>
          </div>`;
      }).join('');
    }

    function loadCaseByName(caseName) {
      const cases = getAllCases();
      const s = cases[caseName];
      if (!s) { alert('Case not found.'); return; }

      document.getElementById('bench').value = s.bench || '';
      document.getElementById('benchNo').value = s.benchNo || '';
      document.getElementById('caseType').value = s.caseType || '';
      onCaseTypeChange();
      document.getElementById('petitionNo').value = s.petitionNo || '';
      document.getElementById('petitionYear').value = s.petitionYear || '';
      document.getElementById('citation').value = s.citation || '';
      if (document.getElementById('applicationNo')) document.getElementById('applicationNo').value = s.applicationNo || '';
      if (document.getElementById('applicationYear')) document.getElementById('applicationYear').value = s.applicationYear || '';
      if (document.getElementById('applicant')) document.getElementById('applicant').value = s.applicant || '';
      if (document.getElementById('applicantAddress')) document.getElementById('applicantAddress').value = s.applicantAddress || '';
      if (document.getElementById('appRespondent')) document.getElementById('appRespondent').value = s.appRespondent || '';
      if (document.getElementById('appRespondentAddress')) document.getElementById('appRespondentAddress').value = s.appRespondentAddress || '';
      if (document.getElementById('advocateName')) document.getElementById('advocateName').value = s.advocateName || '';
      if (document.getElementById('advocateAddress')) document.getElementById('advocateAddress').value = s.advocateAddress || '';
      const sideEl = document.getElementById('advocateSide');
      if (sideEl && s.advocateSide) sideEl.value = s.advocateSide;

      document.getElementById('petitioners').innerHTML = '';
      document.getElementById('respondents').innerHTML = '';
      (s.petitioners || []).forEach(p => {
        addParty('petitioners', 'Petitioner');
        const cards = document.querySelectorAll('#petitioners .party-card');
        const last = cards[cards.length - 1];
        last.querySelector('.partyName').value = p.name || '';
        last.querySelectorAll('.field')[1].value = p.address || '';
        const typeEl = last.querySelector('.partyType');
        if (typeEl && p.type) typeEl.value = p.type;
      });
      (s.respondents || []).forEach(p => {
        addParty('respondents', 'Respondent');
        const cards = document.querySelectorAll('#respondents .party-card');
        const last = cards[cards.length - 1];
        last.querySelector('.partyName').value = p.name || '';
        last.querySelectorAll('.field')[1].value = p.address || '';
        const typeEl = last.querySelector('.partyType');
        if (typeEl && p.type) typeEl.value = p.type;
      });

      updateVakalatnama();
      const toCheck = new Set(s.vakalatnamaChecked || []);
      if (toCheck.size) {
        document.querySelectorAll('#vakalatnamaParties input[type="checkbox"]').forEach(cb => {
          if (toCheck.has(cb.value)) cb.checked = true;
        });
      }

      _currentCaseName = caseName;
      document.getElementById('loadCaseModal').classList.remove('open');
      showSaveStatus('Case loaded');
    }

    function deleteCaseByName(caseName) {
      if (!confirm(`Delete "${caseName}"? This cannot be undone.`)) return;
      const cases = getAllCases();
      delete cases[caseName];
      localStorage.setItem(CASES_KEY, JSON.stringify(cases));
      if (_currentCaseName === caseName) _currentCaseName = null;
      loadCase(); // refresh list
    }

    function closeLoadCaseModal() { document.getElementById('loadCaseModal').classList.remove('open'); }

    /* ══════════════════════════════════════════════════════════
       SAVE STATUS
    ══════════════════════════════════════════════════════════ */
    let _saveStatusTimeout = null;
    function showSaveStatus(text) {
      const el = document.getElementById('saveStatus');
      if (!el) return;
      el.textContent = text;
      el.classList.add('visible');
      clearTimeout(_saveStatusTimeout);
      _saveStatusTimeout = setTimeout(() => el.classList.remove('visible'), 3000);
    }

    /* ══════════════════════════════════════════════════════════
       ADVOCATES — localStorage
    ══════════════════════════════════════════════════════════ */
    let savedAdvocates = JSON.parse(localStorage.getItem('nclt_advocates') || '[]');

    function refreshAdvocateDropdown() {
      const dd = document.getElementById('advocateDropdown');
      dd.innerHTML = '<option value="">— Select saved —</option>';
      savedAdvocates.forEach((adv, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = adv.name + (adv.address ? ' — ' + adv.address : '');
        dd.appendChild(opt);
      });
    }

    function onAdvocateSelect() {
      const dd = document.getElementById('advocateDropdown');
      if (dd.value === '') return;
      const adv = savedAdvocates[parseInt(dd.value)];
      if (!adv) return;
      document.getElementById('advocateName').value = adv.name || '';
      document.getElementById('advocateAddress').value = adv.address || '';
      const sideEl = document.getElementById('advocateSide');
      if (sideEl && adv.side) {
        const opt = sideEl.querySelector(`option[value="${adv.side}"]`);
        if (opt) sideEl.value = adv.side;
      }
    }

    function saveAdvocate() {
      const name    = document.getElementById('advocateName').value.trim();
      const address = document.getElementById('advocateAddress').value.trim();
      const side    = document.getElementById('advocateSide')?.value || '';
      if (!name) { alert('Please enter a name first.'); return; }
      const existing = savedAdvocates.findIndex(a => a.name.toLowerCase() === name.toLowerCase());
      if (existing >= 0) {
        savedAdvocates[existing].address = address;
        savedAdvocates[existing].side    = side;
      } else {
        savedAdvocates.push({ name, address, side });
      }
      localStorage.setItem('nclt_advocates', JSON.stringify(savedAdvocates));
      refreshAdvocateDropdown();
      const msg = document.getElementById('advocateSavedMsg');
      msg.textContent = name + ' saved';
      msg.style.display = 'inline';
      setTimeout(() => msg.style.display = 'none', 2500);
    }

    function removeAdvocate() {
      const dd = document.getElementById('advocateDropdown');
      if (dd.value === '') { alert('Select an advocate from the dropdown first.'); return; }
      const idx = parseInt(dd.value);
      const name = savedAdvocates[idx]?.name;
      if (!confirm(`Remove "${name}" from saved advocates?`)) return;
      savedAdvocates.splice(idx, 1);
      localStorage.setItem('nclt_advocates', JSON.stringify(savedAdvocates));
      refreshAdvocateDropdown();
      document.getElementById('advocateName').value = '';
      document.getElementById('advocateAddress').value = '';
      const sideEl = document.getElementById('advocateSide');
      if (sideEl) sideEl.value = '';
    }

    /* ══════════════════════════════════════════════════════════
       INIT
    ══════════════════════════════════════════════════════════ */
    window.onload = () => {
      const BENCHES = ["Mumbai","Delhi","Ahmedabad","Bengaluru","Chennai","Kolkata","Hyderabad","Jaipur"];
      BENCHES.forEach(b => bench.innerHTML += `<option>${b}</option>`);
      caseType.innerHTML = `
        <optgroup label="— Petitions (Companies Act)">
          <option value="TP_CA">Transfer Petition (Company Act)</option>
          <option value="CP_CA">Company Petition (Company Act)</option>
          <option value="RP_CA">Rehabilitation Petition (Company Act)</option>
          <option value="IP_CA">Intervention Petition (Company Act)</option>
          <option value="CONT_CA">Contempt Petition (Company Act)</option>
          <option value="EXEC_CA">Execution Petition (Company Act)</option>
          <option value="CPAA_CA">CP(AA) Merger &amp; Amalgamation (Company Act)</option>
          <option value="REST_CP_CA">Restored Company Petition (Companies Act)</option>
        </optgroup>
        <optgroup label="— Petitions (IBC)">
          <option value="CP_IBC">Company Petition IB (IBC)</option>
          <option value="RP_IBC">Rehabilitation Petition (IBC)</option>
          <option value="IP_IBC">Intervention Petition (IBC)</option>
          <option value="CONT_IBC">Contempt Petition (IBC)</option>
          <option value="TP_IBC">Transfer Petition (IBC)</option>
          <option value="REST_CP_IBC">Restored Company Petition (IBC)</option>
        </optgroup>
        <optgroup label="— Applications (Companies Act)">
          <option value="IA_CA">Interlocutory Application (Company Act)</option>
          <option value="REV_CA">Review Application (Company Act)</option>
          <option value="REST_APP_CA">Restoration Application (Company Act)</option>
          <option value="CROSS_CA">Cross Application (Company Act)</option>
          <option value="MA_CA">Miscellaneous Application (Company Act)</option>
          <option value="CA_CA">Company Application (Company Act)</option>
          <option value="CAA_CA">CA(A) Merger &amp; Amalgamation (Company Act)</option>
          <option value="TA_CA">Transfer Application (Company Act)</option>
        </optgroup>
        <optgroup label="— Applications (IBC)">
          <option value="CA_IBC">Company Application (IBC)</option>
          <option value="IA_IBC">Interlocutory Application (IBC)</option>
          <option value="REV_IBC">Review Application (IBC)</option>
          <option value="REST_APP_IBC">Restoration Application (IBC)</option>
          <option value="CROSS_IBC">Cross Application (IBC)</option>
          <option value="MA_IBC">Miscellaneous Application (IBC)</option>
          <option value="IA_IBC_PLAN">Interlocutory Application (IBC)(Plan)</option>
          <option value="IA_IBC_LIQ">Interlocutory Application (IBC)(Liq.)</option>
          <option value="IA_IBC_DIS">Interlocutory Application (IBC)(Dis.)</option>
          <option value="IA_LIQ_PROGRESS">IA (Liq.) Progress Report (IBC)</option>
        </optgroup>`;
      onCaseTypeChange();
      refreshAdvocateDropdown();
      addParty('petitioners', 'Petitioner');
      addParty('respondents', 'Respondent');
    };

    /* Close modals on overlay click */
    ['saveCaseModal','loadCaseModal','docModal','partyModal'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', function(e) { if (e.target === this) this.classList.remove('open'); });
    });
