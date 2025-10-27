import { useMemo } from 'react';
import type { Room, Bill, CalculationWeights, Result } from '../types';

export const useBillCalculation = (
  rooms: Room[],
  bill: Bill,
  weights: CalculationWeights
): Result[] => {
  return useMemo(() => {
    // اعتبارسنجی اولیه
    if (!bill.amount || bill.amount <= 0) {
      return [];
    }

    // مرحله ۰: محاسبه مقادیر کل برای به دست آوردن نسبت‌ها
    const totalArea = rooms.reduce((sum, room) => sum + room.area, 0);
    const totalPersonDays = rooms
      .flatMap(room => room.occupants)
      .reduce((sum, person) => sum + person.daysPresent, 0);

    // جلوگیری از تقسیم بر صفر در صورتی که مساحت یا حضور افراد صفر باشد
    if (totalArea === 0 || totalPersonDays === 0) {
      return [];
    }
    
    // مرحله ۱: محاسبه هزینه کل برای هر اتاق
    const areaBillPortion = bill.amount * weights.area;
    const personDaysBillPortion = bill.amount * weights.personDays;

    const roomCosts = rooms.map(room => {
      // بخش الف: سهم اتاق از قبض بر اساس مساحت
      const roomAreaCost = (room.area / totalArea) * areaBillPortion;
      
      // بخش ب: سهم اتاق از قبض بر اساس نفر-روز
      const roomPersonDays = room.occupants.reduce((sum, p) => sum + p.daysPresent, 0);
      const roomPersonDayCost = (roomPersonDays / totalPersonDays) * personDaysBillPortion;
      
      // هزینه کل برای اتاق، مجموع هر دو بخش است
      const totalRoomCost = roomAreaCost + roomPersonDayCost;

      return {
        ...room,
        totalRoomCost,
        roomPersonDays,
      };
    });

    // مرحله ۲: تقسیم هزینه کل هر اتاق بین ساکنین آن
    const finalResults: Result[] = [];
    
    roomCosts.forEach(room => {
      room.occupants.forEach(occupant => {
        let personShare = 0;
        
        // تقسیم هزینه بر اساس روزهای حضور
        if (room.roomPersonDays > 0) {
          personShare = (occupant.daysPresent / room.roomPersonDays) * room.totalRoomCost;
        } 
        // حالت خاص: اگر هیچ‌کس حضور نداشته (۰ روز برای همه)، اما ساکنینی وجود دارند،
        // هزینه اتاق (که فقط هزینه مساحت آن خواهد بود) به طور مساوی تقسیم می‌شود.
        else if (room.occupants.length > 0) {
          personShare = room.totalRoomCost / room.occupants.length;
        }

        finalResults.push({
          name: occupant.name,
          share: personShare,
        });
      });
    });

    return finalResults;
  }, [rooms, bill, weights]);
};
