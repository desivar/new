// src/pages/PipelineBoard.jsx
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

import JobCard from '../components/JobCard'; // Your JobCard component
import { getAllJobs, updateJob } from '../api/jobs'; // API functions for jobs
import { getAllPipelines } from '../api/pipelines'; // API functions for pipelines
import './PipelineBoard.css'; // Create this CSS file for board layout

function PipelineBoard() {
  const [jobs, setJobs] = useState([]);
  const [pipelines, setPipelines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobsData, pipelinesData] = await Promise.all([
          getAllJobs(),
          getAllPipelines()
        ]);
        setJobs(jobsData);
        setPipelines(pipelinesData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load jobs or pipelines. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // You would implement onDragEnd logic here if using react-beautiful-dnd
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Simulate update logic for now (real DND needs proper state updates and reordering)
    // Find the job that was dragged
    const draggedJob = jobs.find(job => job._id === draggableId);
    if (!draggedJob) return;

    // Get the new pipeline step (column ID)
    const newPipelineStep = destination.droppableId;

    // Call backend to update the job's pipeline_step
    try {
        await updateJob(draggedJob._id, { ...draggedJob, pipeline_step: newPipelineStep });
        // Update local state after successful backend update
        setJobs(prevJobs =>
            prevJobs.map(job =>
                job._id === draggedJob._id ? { ...job, pipeline_step: newPipelineStep } : job
            )
        );
        console.log(`Job ${draggableId} moved to step ${newPipelineStep}`);
    } catch (err) {
        console.error('Failed to update job pipeline step:', err);
        setError('Could not update job step on backend.');
    }
  };


  if (loading) return <div>Loading jobs and pipelines...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (pipelines.length === 0) return <div>No pipelines defined. Please create some in the Pipelines section.</div>;

  // Assuming a single "active" pipeline for now, or you'd let the user select one
  // For simplicity, let's just use the first pipeline found or a default if none exists
  const activePipeline = pipelines[0];
  if (!activePipeline) return <div>No pipelines available.</div>;

  // Group jobs by their current pipeline step
  const jobsByStep = activePipeline.steps.reduce((acc, step) => {
    acc[step] = jobs.filter(job => job.pipeline_step === step);
    return acc;
  }, {});

  return (
    <div className="pipeline-board-container">
      <h2>Job Pipeline Board</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="pipeline-columns">
          {activePipeline.steps.map((step) => (
            <div key={step} className="pipeline-column">
              <h3>{step}</h3>
              <Droppable droppableId={step}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="column-content"
                  >
                    {jobsByStep[step] && jobsByStep[step].map((job, index) => (
                      <Draggable key={job._id} draggableId={job._id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                                <JobCard
                                  key={job._id}
                                  title={job.job_name}
                                  value={1000} // Placeholder, assuming value is on job or derived
                                />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <button className="add-job-button">+ Add Job</button> {/* Link to Job creation form */}
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default PipelineBoard;