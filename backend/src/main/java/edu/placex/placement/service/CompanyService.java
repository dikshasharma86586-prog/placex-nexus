package edu.placex.placement.service;

import edu.placex.placement.dto.CompanyRequest;
import edu.placex.placement.exception.ApiException;
import edu.placex.placement.model.Company;
import edu.placex.placement.repository.CompanyRepository;
import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CompanyService {
    private static final Set<String> STATUSES = Set.of("Active", "Completed", "On hold");
    private final CompanyRepository companies;
    public CompanyService(CompanyRepository companies) { this.companies = companies; }

    public List<Company> findAll() { return companies.findAll(); }
    public Company findById(String id) { return companies.findById(id).orElseThrow(() -> ApiException.notFound("Company was not found.")); }

    @Transactional
    public Company create(CompanyRequest request) {
        if (companies.findById(request.id()).isPresent()) throw ApiException.conflict("A company with this ID already exists.");
        validateStatus(request.status());
        companies.save(request);
        return findById(request.id());
    }

    @Transactional
    public Company update(String id, CompanyRequest request) {
        findById(id);
        validateStatus(request.status());
        companies.save(new CompanyRequest(id, request.name(), request.industry(), request.role(), request.minCgpa(), request.branches(),
                request.packageLpa(), request.positions(), request.maxBacklogs(), request.status()));
        return findById(id);
    }

    @Transactional
    public void delete(String id) {
        findById(id);
        if (companies.hasDrives(id)) throw ApiException.conflict("This company has placement drives. Delete its drives after removing dependent applications first.");
        companies.delete(id);
    }

    private void validateStatus(String status) {
        if (!STATUSES.contains(status)) throw ApiException.badRequest("Company status must be Active, Completed, or On hold.");
    }
}
