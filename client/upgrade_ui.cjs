const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src/pages');
const targetFiles = [
    'Customers/CustomerImportExport.jsx',
    'Categories/CategoryImportExport.jsx',
    'Positions/PositionImportExport.jsx',
    'Imports/ImportImportExport.jsx'
];

const newReturnBlock = `    return (
        <div className="voucher-import-export">
            <input type="file" ref={fileRef} style={{ display: 'none' }} accept=".xlsx,.xls,.json" onChange={handleImportFile} />
            <button className="btn-secondary btn-import-export" onClick={() => setShowExport(true)}>
                {importLoading ? <span className="spinner"></span> : Ico.file} <span>Nhập / Xuất dữ liệu</span>
            </button>

            {showExport && (
                <Modal title="Công cụ Nhập / Xuất Dữ Liệu" onClose={() => setShowExport(false)}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <label className="form-label" style={{ fontWeight: 600 }}>Tải dữ liệu lên (Import)</label>
                        <button className="btn-outline" style={{ width: '100%', display: 'flex', gap: '8px', justifyContent: 'center' }} onClick={() => { setShowExport(false); fileRef.current?.click(); }} disabled={importLoading}>
                            {Ico.upload} Chọn file tải lên (.xlsx, .json)
                        </button>
                        
                        <div style={{ height: 1, background: 'var(--border)', margin: '14px 0' }}></div>
                        
                        <label className="form-label" style={{ fontWeight: 600 }}>Tải dữ liệu xuống (Export)</label>
                        <button className="btn-primary" style={{ width: '100%', display: 'flex', gap: '8px', justifyContent: 'center' }} onClick={handleExportExcel}>{Ico.fileExcel} Xuất Excel (.xlsx)</button>
                        <button className="btn-outline" style={{ width: '100%', display: 'flex', gap: '8px', justifyContent: 'center' }} onClick={handleExportJson}>{Ico.fileJson} Xuất JSON (.json)</button>
                        
                        <button className="btn-text" style={{ width: '100%', marginTop: '8px' }} onClick={() => setShowExport(false)}>Đóng lại</button>
                    </div>
                </Modal>
            )}
        </div>
    );
};
`;

let modifiedCount = 0;

targetFiles.forEach(relPath => {
    const fullPath = path.join(srcDir, relPath);
    if (!fs.existsSync(fullPath)) return;
    
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Find the start of the return statement
    const returnIndex = content.lastIndexOf('return (');
    if (returnIndex !== -1) {
        // Find the boundary to replace
        let startToReplace = content.substring(0, returnIndex);
        
        // Write the new content
        const finalContent = startToReplace + newReturnBlock;
        fs.writeFileSync(fullPath, finalContent, 'utf8');
        modifiedCount++;
        console.log('Upgraded UI for', path.basename(relPath));
    }
});

console.log(`Upgraded UI in ${modifiedCount} files`);
