import React from 'react';
import Card from './Card';
import Button from './Button';
import { Calendar, FileText, CheckCircle, Clock } from 'lucide-react';

const AssignmentCard = ({ assignment, onAction }) => {
  const isSubmitted = assignment.status === 'Submitted';

  return (
    <Card className="hover:border-accent/20 border-2 border-transparent transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isSubmitted ? 'bg-teal-50 text-teal-600' : 'bg-orange-50 text-orange-600'}`}>
            <FileText size={20} />
          </div>
          <div>
            <h4 className="font-bold text-primary">{assignment.title}</h4>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar size={12} />
              <span>Due {assignment.dueDate}</span>
            </div>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-bold ${
          isSubmitted ? 'bg-teal-100 text-teal-700' : 'bg-orange-100 text-orange-700'
        }`}>
          {assignment.status}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-6 line-clamp-2">
        {assignment.description || 'No description provided.'}
      </p>

      <div className="flex gap-2">
        {!isSubmitted && (
          <Button size="sm" onClick={() => onAction(assignment)}>
            Submit Now
          </Button>
        )}
        {assignment.oneDriveLink && (
          <Button variant="outline" size="sm" as="a" href={assignment.oneDriveLink} target="_blank">
            View Material
          </Button>
        )}
      </div>
    </Card>
  );
};

export default AssignmentCard;
