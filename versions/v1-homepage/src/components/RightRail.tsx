import React from 'react';
import { motion } from 'framer-motion';
import { Doctor, Location, Condition } from '../data/searchIndex';
import { MapPin, Activity } from 'lucide-react';
interface RightRailProps {
  query: string;
  topics: string[];
  doctors: Doctor[];
  locations: Location[];
  conditions: Condition[];
  onTopicClick: (topic: string) => void;
}
export function RightRail({
  query,
  topics,
  doctors,
  locations,
  conditions,
  onTopicClick
}: RightRailProps) {
  return (
    <div className="space-y-10 pl-0 lg:pl-8 lg:border-l lg:border-border">
      {/* Topics Panel */}
      {topics.length > 0 &&
      <motion.div
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          delay: 0
        }}>
        
          <h3 className="text-xs font-bold text-endeavor-navy uppercase tracking-wider mb-4">
            Related Topics
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {topics.map((topic, i) =>
          <button
            key={i}
            onClick={() => onTopicClick(topic)}
            className="px-4 py-1.5 text-sm bg-surface border border-border rounded-full hover:border-neutral-400 hover:bg-endeavor-lavender transition-colors text-neutral-700">
            
                {topic}
              </button>
          )}
          </div>
          <button className="text-sm text-endeavor-blue hover:underline transition-colors">
            See all
          </button>
        </motion.div>
      }

      {/* Conditions Panel */}
      {conditions.length > 0 &&
      <motion.div
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          delay: 0.05
        }}>
        
          <h3 className="text-xs font-bold text-endeavor-navy uppercase tracking-wider mb-4">
            Conditions matching {query}
          </h3>
          <div className="flex flex-col">
            {conditions.slice(0, 4).map((condition) =>
          <div
            key={condition.id}
            className="flex items-start gap-3 py-3 border-b border-border last:border-0">
            
                <div className="mt-0.5 p-1.5 bg-neutral-100 rounded-full text-neutral-500 shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-primary text-sm">
                    {condition.name}
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5 leading-snug">
                    {condition.description}
                  </div>
                </div>
              </div>
          )}
          </div>
          {conditions.length > 4 &&
        <button className="text-sm text-endeavor-blue hover:underline transition-colors mt-3">
              See all
            </button>
        }
        </motion.div>
      }

      {/* Doctors Panel */}
      {doctors.length > 0 &&
      <motion.div
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          delay: 0.1
        }}>
        
          <h3 className="text-xs font-bold text-endeavor-navy uppercase tracking-wider mb-4">
            People matching {query}
          </h3>
          <div className="flex flex-col">
            {doctors.slice(0, 3).map((doctor) =>
          <div
            key={doctor.id}
            className="flex items-center justify-between py-3 border-b border-border last:border-0">
            
                <div className="flex items-center gap-3">
                  <img
                src={doctor.photoUrl}
                alt={doctor.name}
                className="w-10 h-10 rounded-full object-cover border border-border" />
              
                  <div>
                    <div className="font-medium text-primary text-sm">
                      {doctor.name}
                    </div>
                    <div className="text-xs text-neutral-500">
                      {doctor.specialty}
                    </div>
                  </div>
                </div>
                <button className="px-4 py-1.5 bg-endeavor-blue text-white rounded-full text-xs font-bold hover:bg-endeavor-blueHover transition-colors">
                  Schedule
                </button>
              </div>
          )}
          </div>
          {doctors.length > 3 &&
        <button className="text-sm text-endeavor-blue hover:underline transition-colors mt-3">
              See all
            </button>
        }
        </motion.div>
      }

      {/* Locations Panel */}
      {locations.length > 0 &&
      <motion.div
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          delay: 0.15
        }}>
        
          <h3 className="text-xs font-bold text-endeavor-navy uppercase tracking-wider mb-4">
            Locations matching {query}
          </h3>
          <div className="flex flex-col">
            {locations.slice(0, 3).map((location) =>
          <div
            key={location.id}
            className="flex items-start gap-3 py-3 border-b border-border last:border-0">
            
                <div className="mt-0.5 p-1.5 bg-neutral-100 rounded-full text-neutral-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-primary text-sm">
                    {location.name}
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    {location.address}
                  </div>
                </div>
                <div className="text-xs text-neutral-400 whitespace-nowrap">
                  {location.distance}
                </div>
              </div>
          )}
          </div>
          {locations.length > 3 &&
        <button className="text-sm text-endeavor-blue hover:underline transition-colors mt-3">
              See all
            </button>
        }
        </motion.div>
      }
    </div>);

}