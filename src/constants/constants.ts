// @ts-nocheck


export const client = ["Client 1", "Client 2", "Client 3", "Client 4", "Client 5"];
export const project = ["Project 1", "Project 2", "Project 3", "Project 4", "Project 5"];
export const span = ["Span 1", "Span 2", "Span 3", "Span 4", "Span 5"];
export const pick = ["Pick 1", "Pick 2", "Pick 3", "Pick 4", "Pick 5"];
export const projectType = ["Project Type 1", "Project Type 2", "Project Type 3", "Project Type 4", "Project Type 5"];

export function generateExtfiledataArrays() {
    const arraysOfExtfiledata = [];
    for (let i = 0; i < 30; i++) {
        const array = [];
        for (let j = 1; j <= 50; j++) {
            const extfiledata = {
                filename: `file${(i * 50 + j)}.txt`,
                createdAt: `${j} day${j !== 1 ? 's' : ''} ago`
            };
            array.push(extfiledata);
        }
        arraysOfExtfiledata.push(array);
    }
    return arraysOfExtfiledata;
}

export const sampleCTemplateData = {
    id: 1,
    title: "Sample Template",
    access: 1,
    status: "Active",
    extension: "pdf",
    file_name: "sample.pdf",
    google_file_id: "google_file_id_123",
    g_drive_url: "https://drive.google.com/sample",
    g_suit_url: "https://suit.google.com/sample",
    download_url: "https://example.com/sample.pdf",
    is_uploaded: 1,
    creator_group_id: 123,
    created_by: 456,
    updated_by: 456,
    draft_status: 0,
    isEditing: 0,
    isAdmin: 1
};

export const sampleCTemplateData2 = {
    id: 2,
    title: "Sample Template2",
    access: 2,
    status: "Active",
    extension: "pdf",
    file_name: "sample2.pdf",
    google_file_id: "google_file_id_123",
    g_drive_url: "https://drive.google.com/sample",
    g_suit_url: "https://suit.google.com/sample",
    download_url: "https://example.com/sample.pdf",
    is_uploaded: 1,
    creator_group_id: 123,
    created_by: 456,
    updated_by: 456,
    draft_status: 0,
    isEditing: 0,
    isAdmin: 1
};

export const sampleCTemplateData3 = {
    id: 3,
    title: "Sample Template3",
    access: 2,
    status: "Active",
    extension: "pdf",
    file_name: "sample2.pdf",
    google_file_id: "google_file_id_123",
    g_drive_url: "https://drive.google.com/sample",
    g_suit_url: "https://suit.google.com/sample",
    download_url: "https://example.com/sample.pdf",
    is_uploaded: 1,
    creator_group_id: 123,
    created_by: 456,
    updated_by: 456,
    draft_status: 0,
    isEditing: 0,
    isAdmin: 1
};

export const sampleCTemplatesData = {
    per_page: 10,
    total: 100,
    data: [sampleCTemplateData, sampleCTemplateData2, sampleCTemplateData3]
};

export const testUser = {
    id: "123",
    name: "John Doe",
    role_id: "456",
    workflow_id: "789",
    full_name: "John Doe",
    email: "john.doe@example.com",
    comments: "",
    quota: 100,
    token: "abc123",
    group_members_count: 5,
    group_id: "789",
    is_group_admin: "1"
};
