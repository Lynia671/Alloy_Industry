//ai写的但是没用,还得再研究下


// 引入原生类
const Planet = Packages.mindustry.world.meta.Planet;
const SectorPreset = Packages.mindustry.game.SectorPreset;
const Planets = Packages.mindustry.content.Planets;
const SerpuloPlanetGenerator = Packages.mindustry.world.generators.SerpuloPlanetGenerator;
const Objectives = Packages.mindustry.game.Objectives;
const Seq = Packages.arc.struct.Seq;
const Color = Packages.arc.graphics.Color;
const Core = Packages.arc.Core;
const MultiMesh = Packages.mindustry.world.mesh.MultiMesh;
const HexMesh = Packages.mindustry.world.mesh.HexMesh;
const prov = Packages.arc.func.Prov;
const ContentItems = Packages.mindustry.content.Items; // 如果需要物品

// ==========================================
// 1. 创建星球：斯维特顿 (原生写法)
// ==========================================
const SVITETUN = new Planet("svitetun", Planets.sun, 1, 3.3);

SVITETUN.meshLoader = prov(() => new MultiMesh(new HexMesh(SVITETUN, 8)));
SVITETUN.generator = new SerpuloPlanetGenerator();
SVITETUN.visible = true;
SVITETUN.accessible = true;
SVITETUN.alwaysUnlocked = false;
SVITETUN.clearSectorOnLose = true;
SVITETUN.localizedName = "斯维特顿";
SVITETUN.startSector = "svitetun-1";
SVITETUN.orbitRadius = 90;
SVITETUN.orbitTime = 200 * 60;
SVITETUN.rotateTime = 100 * 60;
SVITETUN.atmosphereRadIn = 0.02;
SVITETUN.atmosphereRadOut = 0.3;
SVITETUN.atmosphereColor = Color.valueOf("A0D8EF90");
SVITETUN.lightColor = Color.valueOf("A0D8EF90");
SVITETUN.iconColor = Color.valueOf("A0D8EF");
SVITETUN.bloom = false;
SVITETUN.tidalLock = false;
SVITETUN.prebuildBase = false;

// ==========================================
// 2. 定义关卡
// ==========================================
function createSector(id, name, desc, diff, wave, mapFile) {
    const sector = new SectorPreset(id, SVITETUN, diff);
    sector.localizedName = name;
    sector.description = desc;
    sector.difficulty = diff;
    sector.captureWave = wave;
    sector.addStartingItems = true;
    sector.alwaysUnlocked = false;
    sector.overrideMap = Core.files.internal("maps/" + mapFile);
    return sector;
}

const s1 = createSector("svitetun-1", "零下地区", "冰封荒原，生存第一。", 1, 10, "svitetun-1.msav");
const s2 = createSector("svitetun-2", "寒冰谷", "冰川峡谷，小心伏击。", 3, 15, "svitetun-2.msav");
const s3 = createSector("svitetun-3", "永冻深渊", "深不见底的冰渊。", 5, 20, "svitetun-3.msav");
const s4 = createSector("svitetun-4", "冻石峡谷", "坚硬的冻土防线。", 7, 25, "svitetun-4.msav");
const s5 = createSector("svitetun-5", "溶蚀冰河", "酸性融水，环境恶劣。", 9, 30, "svitetun-5.msav");
const s6 = createSector("svitetun-6", "死火山带", "最后的决战！", 10, 40, "svitetun-6.msav");
s6.isLastSector = true;

// ==========================================
// 3. 连接科技树 (原生写法，替代 SFlib.addToResearch)
// ==========================================
// 原生写法需要手动设置 sector 的 requirements 或者通过 Objectives 关联
// 但 Mindustry 的 JS 接口中，SectorPreset 没有直接的 .setRequirements 方法供 JS 调用
// 我们通常采用“隐式连接”：只要 parent 解锁了，子节点自然可见（如果 alwaysUnlocked=false）
// 更严谨的做法是使用 Objectives，但这通常需要配合 ContentRegistry 注册

// 【重要技巧】：在纯 JS 模组中，最简单的连接方式是依靠 ID 顺序和 startSector
// 或者，我们可以利用 Mindustry 的机制：
// 只要 s1 被解锁（通过完成 planetaryTerminal），s2 就会因为 s1 是其前置而显示吗？
// 不，JS 中我们需要显式添加目标。

// 由于 JS 直接操作 Objectives 比较繁琐，这里提供一个简化的“硬连接”方案：
// 我们假设玩家解锁了 planetaryTerminal 后，手动点击 s1 即可（如果 alwaysUnlocked=false 且无前置，可能无法点击）
// **修正方案**：我们必须模拟 SFlib 的逻辑。

// 既然你没有 SFlib，我们用这个万能补丁函数来模拟连接：
function linkSectors(child, parentID) {
    // 获取父节点预设 (如果是字符串 ID，尝试从全局找，这里简化处理)
    // 注意：纯原生 JS 很难动态获取另一个 SectorPreset 对象，除非它们已经在全局变量里
    // 所以我们在下面直接写死
    
    if (parentID === "planetaryTerminal") {
        // 连接到原版行星终端
        child.requirements = Seq.with(
            new Objectives.SectorComplete(Packages.mindustry.game.SectorPresets.planetaryTerminal)
        );
    } else if (parentID === "svitetun-1") {
        child.requirements = Seq.with(new Objectives.SectorComplete(s1));
    } else if (parentID === "svitetun-2") {
        child.requirements = Seq.with(new Objectives.SectorComplete(s2));
    } else if (parentID === "svitetun-3") {
        child.requirements = Seq.with(new Objectives.SectorComplete(s3));
    } else if (parentID === "svitetun-4") {
        child.requirements = Seq.with(new Objectives.SectorComplete(s4));
    } else if (parentID === "svitetun-5") {
        child.requirements = Seq.with(new Objectives.SectorComplete(s5));
    }
}

// 应用连接
linkSectors(s1, "planetaryTerminal");
linkSectors(s2, "svitetun-1");
linkSectors(s3, "svitetun-2");
linkSectors(s4, "svitetun-3");
linkSectors(s5, "svitetun-4");
linkSectors(s6, "svitetun-5");

export const sviteton = SVITETUN;