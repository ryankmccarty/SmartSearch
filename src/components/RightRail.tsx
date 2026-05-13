import React from 'react';
import { motion } from 'framer-motion';
import { Doctor, Location, Condition } from '../data/searchIndex';
import { MapPin, Activity, CalendarDays, ChevronRight } from 'lucide-react';

interface User {
  firstName: string;
  primaryDoctor: { id: string; name: string; specialty: string; photoUrl: string };
  upcomingAppointment: { doctor: string; type: string; date: string; time: string };
  followedTopics: string[];
}

interface RightRailProps {
  query: string;
  topics: string[];
  doctors: Doctor[];
  locations: Location[];
  conditions: Condition[];
  onTopicClick: (topic: string) => void;
  isLoggedIn?: boolean;
  user?: User;
}

export function RightRail({ query, topics, doctors, locations, conditions, onTopicClick, isLoggedIn, user }: RightRailProps) {
  return (
    <div className="space-y-8 pl-0 lg:pl-8 lg:border-l lg:border-border">

      {/* ── Logged-in: upcoming appointment ── */}
      {isLoggedIn && user && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <h3 className="text-xs font-bold text-endeavor-navy uppercase tracking-wider mb-3">Your next appointment</h3>
          <div className="bg-endeavor-lavender border border-endeavor-blue/15 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-endeavor-blue flex items-center justify-center shrink-0">
                <CalendarDays className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-endeavor-navy leading-tight">{user.upcomingAppointment.type}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{user.upcomingAppointment.doctor}</p>
                <p className="text-xs font-medium text-endeavor-blue mt-1">{user.upcomingAppointment.date} · {user.upcomingAppointment.time}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="flex-1 py-1.5 text-xs font-bold bg-endeavor-blue text-white rounded-full hover:bg-endeavor-blueHover transition-colors">
                View details
              </button>
              <button className="flex-1 py-1.5 text-xs font-bold bg-white border border-border text-neutral-600 rounded-full hover:bg-neutral-50 transition-colors">
                Reschedule
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Logged-in: your care team ── */}
      {isLoggedIn && user && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <h3 className="text-xs font-bold text-endeavor-navy uppercase tracking-wider mb-3">Your care team</h3>
          <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
            <div className="flex items-center gap-3">
              <img src={user.primaryDoctor.photoUrl} alt={user.primaryDoctor.name} className="w-9 h-9 rounded-full object-cover border border-border" />
              <div>
                <div className="text-sm font-medium text-primary">{user.primaryDoctor.name}</div>
                <div className="text-xs text-neutral-500">{user.primaryDoctor.specialty}</div>
              </div>
            </div>
            <button className="px-3 py-1.5 bg-endeavor-gold text-endeavor-navy rounded-full text-xs font-bold hover:opacity-90 transition-opacity shrink-0">
              Schedule
            </button>
          </div>
          {/* Topics you follow */}
          {user.followedTopics.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-neutral-400 mb-2">Topics you follow</p>
              <div className="flex flex-wrap gap-1.5">
                {user.followedTopics.map(t => (
                  <button key={t} onClick={() => onTopicClick(t)} className="px-2.5 py-1 text-xs bg-white border border-border rounded-full text-neutral-600 hover:border-endeavor-blue/30 hover:text-endeavor-blue transition-colors">
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ── Related Topics ── */}
      {topics.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: isLoggedIn ? 0.1 : 0 }}>
          <h3 className="text-xs font-bold text-endeavor-navy uppercase tracking-wider mb-3">Related topics</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {topics.map((topic, i) => (
              <button key={i} onClick={() => onTopicClick(topic)}
                className="px-3.5 py-1.5 text-sm bg-white border border-border rounded-full hover:border-neutral-400 hover:bg-endeavor-lavender transition-colors text-neutral-700">
                {topic}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Conditions ── */}
      {conditions.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: isLoggedIn ? 0.15 : 0.05 }}>
          <h3 className="text-xs font-bold text-endeavor-navy uppercase tracking-wider mb-3">Conditions matching <span className="normal-case font-normal text-neutral-500">{query}</span></h3>
          <div className="flex flex-col">
            {conditions.slice(0, 4).map(condition => (
              <div key={condition.id} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
                <div className="mt-0.5 p-1.5 bg-neutral-100 rounded-full text-neutral-500 shrink-0">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-primary text-sm">{condition.name}</div>
                  <div className="text-xs text-neutral-500 mt-0.5 leading-snug">{condition.description}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Nearby doctors ── */}
      {doctors.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: isLoggedIn ? 0.2 : 0.1 }}>
          <h3 className="text-xs font-bold text-endeavor-navy uppercase tracking-wider mb-3">
            Providers matching <span className="normal-case font-normal text-neutral-500">{query}</span>
          </h3>
          <div className="flex flex-col">
            {doctors.slice(0, 3).map(doctor => (
              <div key={doctor.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-2.5">
                  <img src={doctor.photoUrl} alt={doctor.name} className="w-8 h-8 rounded-full object-cover border border-border" />
                  <div>
                    <div className="font-medium text-primary text-sm">{doctor.name}</div>
                    <div className="text-xs text-neutral-500">{doctor.specialty}</div>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-endeavor-blue text-white rounded-full text-xs font-bold hover:bg-endeavor-blueHover transition-colors shrink-0">
                  Schedule
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Nearby locations ── */}
      {locations.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: isLoggedIn ? 0.25 : 0.15 }}>
          <h3 className="text-xs font-bold text-endeavor-navy uppercase tracking-wider mb-3">
            Locations matching <span className="normal-case font-normal text-neutral-500">{query}</span>
          </h3>
          <div className="flex flex-col">
            {locations.slice(0, 3).map(location => (
              <div key={location.id} className="flex items-start gap-2.5 py-3 border-b border-border last:border-0">
                <div className="mt-0.5 p-1.5 bg-neutral-100 rounded-full text-neutral-500 shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-primary text-sm">{location.name}</div>
                  <div className="text-xs text-neutral-500 mt-0.5">{location.address}</div>
                </div>
                <div className="text-xs text-neutral-400 whitespace-nowrap shrink-0">{location.distance}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
