import { PrismaClient, Urgency } from "@prisma/client";
import * as bcrypt from "bcrypt";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  const defaultUserEmail = process.env.DEFAULT_USER_EMAIL || "user@gmail.com";
  const defaultUserPassword = process.env.DEFAULT_USER_PASSWORD || "user123";

  const hashedPassword = await bcrypt.hash(defaultUserPassword, 10);

  const user = await prisma.user.upsert({
    where: { email: defaultUserEmail },
    update: {},
    create: {
      email: defaultUserEmail,
      name: "Dwi Wahyu Ilahi",
      password: hashedPassword,
    },
  });

  console.log(
    `Created/found user with ID: ${user.id} and email: ${user.email}`
  );

  const tasksData = [
    {
      title: "Periksa email masuk",
      description: "Balas email penting dari klien X dan Y.",
      urgency: Urgency.CRITICAL,
      userId: user.id,
    },
    {
      title: "Revisi laporan bulanan",
      description: "Perbarui data penjualan Q2 dan tambahkan grafik baru.",
      urgency: Urgency.HIGH,
      userId: user.id,
    },
    {
      title: "Jadwalkan rapat tim",
      description:
        "Temukan slot waktu yang cocok untuk semua anggota tim minggu depan.",
      urgency: Urgency.MEDIUM,
      userId: user.id,
    },
    {
      title: "Membaca artikel teknologi terbaru",
      description:
        "Cari artikel tentang perkembangan AI terkini untuk inspirasi proyek.",
      urgency: Urgency.LOW,
      userId: user.id,
    },
  ];

  for (const taskData of tasksData) {
    const task = await prisma.task.upsert({
      where: {
        title_userId: {
          title: taskData.title,
          userId: taskData.userId,
        },
      },
      update: {},
      create: taskData,
    });
    console.log(
      `Created/found task with ID: ${task.id} and title: ${task.title}`
    );
  }
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
