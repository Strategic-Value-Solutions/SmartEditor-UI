import React, { createContext, useState, useEffect } from 'react';

const ProjectDataContext = createContext();

const ProjectDataContextProvider = ({ children }) => {
  // State to hold project data
  const [projectsData, setProjectsData] = useState(() => {
    const storedProjectsData = localStorage.getItem('projectsData');
    return storedProjectsData ? JSON.parse(storedProjectsData) : [
      {
        id: 101,  // Example ID for projects
        title: "Project 1",
        client: "Client 1",
        project_type: "Type 1",
        edition: "Edition 1",
        version: "1.0",
        sequence_number: "123",
        description: "Description for Project 1",
        span: "Span 1",
        pick: "Pick 1"
      },
      {
        id: 102,
        title: "Project 2",
        client: "Client 2",
        project_type: "Type 2",
        edition: "Edition 2",
        version: "2.0",
        sequence_number: "456",
        description: "Description for Project 2",
        span: "Span 2",
        pick: "Pick 2"
      }
    ];
  });

  // State to hold project name
  const [projectName, setProjectName] = useState('');

  // State to hold configs data
  const [configsData, setConfigsData] = useState(() => {
    const storedConfigsData = localStorage.getItem('configsData');
    return storedConfigsData ? JSON.parse(storedConfigsData) : [
      {
        id: 1,  // Adding unique IDs
        model_name: "Model 1",
        mcc: "MCC1",
        fields_data: {
          field1: "value1",
          field2: "value2",
          field3: "value3"
        },
        last_update: "2024-05-03T12:00:00Z",
        associated_configs: []
      },
      {
        id: 2,  // Adding unique IDs
        model_name: "Model 2",
        mcc: "MCC2",
        fields_data: {
          field1: "value4",
          field2: "value5",
          field3: "value6"
        },
        last_update: "2024-05-03T12:00:00Z",
        associated_configs: []
      }
    ];
  });

  // Effect to sync configs data and project name to local storage
  useEffect(() => {
    localStorage.setItem('configsData', JSON.stringify(configsData));
    localStorage.setItem('projectsData', JSON.stringify(projectsData));
    localStorage.setItem('projectName', JSON.stringify(projectName));
  }, [configsData, projectsData, projectName]);

  // Providing data, setters, and project name
  const value = { configsData, setConfigsData, projectsData, setProjectsData, projectName, setProjectName };

  return (
    <ProjectDataContext.Provider value={value}>
      {children}
    </ProjectDataContext.Provider>
  );
};

export { ProjectDataContext, ProjectDataContextProvider };
