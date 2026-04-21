import React from 'react';
import Card from './Card';
import ProgressBar from './ProgressBar';
import { Users } from 'lucide-react';

const GroupCard = ({ group }) => {
  return (
    <Card title={group.name} subtitle={`${group.members.length} members`}>
      <div className="space-y-6">
        <div className="flex -space-x-2">
          {group.members.map((member, idx) => (
            <div 
              key={idx} 
              className="w-8 h-8 rounded-full bg-primary text-white border-2 border-white flex items-center justify-center text-xs font-bold"
              title={member}
            >
              {member[0]}
            </div>
          ))}
          <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-gray-400">
            <Users size={14} />
          </div>
        </div>

        <ProgressBar progress={group.progress || 0} />
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h5 className="text-xs font-bold text-primary/60 uppercase mb-3">Recent Activity</h5>
          <div className="space-y-2">
            {group.assignments?.slice(0, 2).map((asgn, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-primary/80">{asgn.title}</span>
                <span className={asgn.status === 'Submitted' ? 'text-teal-600' : 'text-orange-600'}>
                  {asgn.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GroupCard;
